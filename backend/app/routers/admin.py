import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from typing import List, Optional
from ..database import get_db
from ..models import Order, OrderItem, Product, ProductImage, Category, User
from ..schemas import (
    AdminStatsOut, OrderOut, OrderStatusUpdate,
    ProductCreate, ProductUpdate, ProductOut,
    CategoryCreate, CategoryUpdate, CategoryOut
)
from ..auth import get_current_admin
from ..config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/dashboard", response_model=AdminStatsOut)
def get_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_orders = db.query(Order).count()
    total_products = db.query(Product).filter(Product.is_active == True).count()
    pending_orders = db.query(Order).filter(Order.order_status == "pending").count()
    low_stock_products = db.query(Product).filter(
        Product.is_active == True,
        Product.stock_quantity <= 5
    ).count()

    # Revenue from non-cancelled orders
    rev_result = db.query(func.sum(Order.total_amount)).filter(
        Order.order_status != "cancelled"
    ).scalar()
    total_revenue = round(float(rev_result or 0.0), 2)

    recent_orders = db.query(Order).options(
        joinedload(Order.items)
    ).order_by(Order.created_at.desc()).limit(6).all()

    return AdminStatsOut(
        total_orders=total_orders,
        total_products=total_products,
        pending_orders=pending_orders,
        low_stock_products=low_stock_products,
        total_revenue=total_revenue,
        recent_orders=recent_orders
    )

# --- Admin Orders ---
@router.get("/orders", response_model=List[OrderOut])
def get_all_orders(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    payment_status: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Order).options(joinedload(Order.items))
    if status:
        query = query.filter(Order.order_status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if search:
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Order.order_number).like(s),
                func.lower(Order.customer_name).like(s),
                func.lower(Order.customer_email).like(s),
                func.lower(Order.customer_phone).like(s)
            )
        )
    return query.order_by(Order.created_at.desc()).all()

@router.patch("/orders/{order_id}", response_model=OrderOut)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if payload.order_status:
        order.order_status = payload.order_status
    if payload.payment_status:
        order.payment_status = payload.payment_status

    db.commit()
    db.refresh(order)
    return order

# --- Admin Products ---
@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Check SKU uniqueness
    if db.query(Product).filter(Product.sku == payload.sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    # Check slug uniqueness
    slug = payload.slug.strip().lower()
    if db.query(Product).filter(Product.slug == slug).first():
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"

    product_data = payload.dict(exclude={"images"})
    product_data["slug"] = slug
    product = Product(**product_data)
    db.add(product)
    db.flush()

    for idx, img in enumerate(payload.images):
        p_img = ProductImage(
            product_id=product.id,
            image_url=img.image_url,
            alt_text=img.alt_text or product.name,
            display_order=img.display_order or idx,
            is_primary=img.is_primary if idx > 0 else True
        )
        db.add(p_img)

    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_dict = payload.dict(exclude_unset=True, exclude={"images"})
    for key, val in update_dict.items():
        setattr(product, key, val)

    if payload.images is not None:
        db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
        for idx, img in enumerate(payload.images):
            p_img = ProductImage(
                product_id=product.id,
                image_url=img.image_url,
                alt_text=img.alt_text or product.name,
                display_order=img.display_order or idx,
                is_primary=img.is_primary if idx > 0 else True
            )
            db.add(p_img)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Soft delete
    product.is_active = False
    db.commit()
    return {"message": "Product deactivated successfully"}

# --- Admin Categories ---
@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if db.query(Category).filter(Category.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Category slug already exists")

    cat = Category(**payload.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, val in payload.dict(exclude_unset=True).items():
        setattr(cat, key, val)

    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.is_active = False
    db.commit()
    return {"message": "Category deactivated successfully"}

# --- Image Upload ---
@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin)
):
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid image type. Allowed: jpg, jpeg, png, webp, gif")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/{unique_filename}"
    return {"url": image_url, "filename": unique_filename}

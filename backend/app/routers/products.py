from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from typing import Optional, List
import math
from ..database import get_db
from ..models import Product, Category, ProductImage
from ..schemas import ProductOut, ProductListResponse

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=ProductListResponse)
def list_products(
    category: Optional[str] = Query(None, description="Category slug or ID"),
    search: Optional[str] = Query(None, description="Search keyword"),
    min_price: Optional[float] = Query(None, description="Minimum price in INR"),
    max_price: Optional[float] = Query(None, description="Maximum price in INR"),
    size: Optional[str] = Query(None, description="Filter by size"),
    color: Optional[str] = Query(None, description="Filter by color"),
    fabric: Optional[str] = Query(None, description="Filter by fabric"),
    is_featured: Optional[bool] = Query(None),
    is_new_arrival: Optional[bool] = Query(None),
    in_stock_only: Optional[bool] = Query(False),
    sort_by: Optional[str] = Query("recommended", description="recommended, newest, price_asc, price_desc, name_asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.images)
    ).filter(Product.is_active == True)

    # Category filter (slug or integer id)
    if category:
        if category.isdigit():
            query = query.filter(Product.category_id == int(category))
        else:
            cat_obj = db.query(Category).filter(
                or_(
                    Category.slug == category,
                    Category.slug == category.replace("-kurta-sets", ""),
                    Category.slug == category.replace("kurtis", "kurtis-kurta-sets"),
                    func.lower(Category.name) == category.lower().replace("-", " "),
                    func.lower(Category.name) == category.lower().replace("-", " & ")
                )
            ).first()
            if cat_obj:
                query = query.filter(Product.category_id == cat_obj.id)
            else:
                return ProductListResponse(items=[], total=0, page=page, size=limit, pages=0)

    # Search filter
    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Product.name).like(term),
                func.lower(Product.description).like(term),
                func.lower(Product.sku).like(term),
                func.lower(Product.fabric).like(term)
            )
        )

    # Price range
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Fabric
    if fabric and fabric.strip():
        query = query.filter(func.lower(Product.fabric).like(f"%{fabric.strip().lower()}%"))

    # Stock
    if in_stock_only:
        query = query.filter(Product.stock_quantity > 0)

    # Flags
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    if is_new_arrival is not None:
        query = query.filter(Product.is_new_arrival == is_new_arrival)

    # Execute all filtered items to apply JSON list matching (SQLite JSON helper)
    all_filtered = query.all()

    # Filter in-memory for JSON sizes and colors if provided
    if size:
        sz_lower = size.strip().lower()
        all_filtered = [p for p in all_filtered if any(sz_lower in str(s).lower() for s in (p.sizes or []))]

    if color:
        cl_lower = color.strip().lower()
        all_filtered = [p for p in all_filtered if any(cl_lower in str(c).lower() for c in (p.colors or []))]

    total = len(all_filtered)

    # Sorting
    if sort_by == "newest":
        all_filtered.sort(key=lambda x: x.created_at or 0, reverse=True)
    elif sort_by == "price_asc":
        all_filtered.sort(key=lambda x: x.price)
    elif sort_by == "price_desc":
        all_filtered.sort(key=lambda x: x.price, reverse=True)
    elif sort_by == "name_asc":
        all_filtered.sort(key=lambda x: x.name.lower())
    else:  # recommended: featured first, then stock > 0, then newest
        all_filtered.sort(key=lambda x: (not x.is_featured, x.stock_quantity <= 0, -(x.id or 0)))

    # Pagination
    total_pages = math.ceil(total / limit) if total > 0 else 0
    start = (page - 1) * limit
    paginated = all_filtered[start:start + limit]

    return ProductListResponse(
        items=paginated,
        total=total,
        page=page,
        size=limit,
        pages=total_pages
    )

@router.get("/meta/filters")
def get_filter_meta(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    all_colors = set()
    all_sizes = set()
    all_fabrics = set()
    min_p = 0.0
    max_p = 50000.0

    if products:
        prices = [p.price for p in products]
        min_p = min(prices)
        max_p = max(prices)
        for p in products:
            if p.fabric:
                all_fabrics.add(p.fabric.strip())
            if p.colors:
                for c in p.colors:
                    if c:
                        all_colors.add(c.strip())
            if p.sizes:
                for s in p.sizes:
                    if s:
                        all_sizes.add(s.strip())

    return {
        "colors": sorted(list(all_colors)),
        "sizes": sorted(list(all_sizes)),
        "fabrics": sorted(list(all_fabrics)),
        "min_price": min_p,
        "max_price": max_p
    }

@router.get("/slug/{slug}", response_model=ProductOut)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.images)
    ).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}", response_model=ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.images)
    ).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}/related", response_model=List[ProductOut])
def get_related_products(product_id: int, limit: int = 4, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    related = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.images)
    ).filter(
        Product.id != product_id,
        Product.category_id == product.category_id,
        Product.is_active == True
    ).limit(limit).all()

    # If less than limit, fill with other featured products
    if len(related) < limit:
        needed = limit - len(related)
        existing_ids = [product_id] + [p.id for p in related]
        additional = db.query(Product).options(
            joinedload(Product.category),
            joinedload(Product.images)
        ).filter(
            ~Product.id.in_(existing_ids),
            Product.is_active == True
        ).limit(needed).all()
        related.extend(additional)

    return related

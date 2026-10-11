import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from ..database import get_db
from ..models import Order, OrderItem, CartItem, Product, User
from ..schemas import OrderCreate, OrderOut
from ..auth import get_optional_user, get_current_user
from ..config import settings

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_order_number() -> str:
    now = datetime.datetime.utcnow()
    rand_suffix = uuid.uuid4().hex[:6].upper()
    return f"DDF-{now.strftime('%Y%m%d')}-{rand_suffix}"

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    # Fetch cart items
    if current_user:
        cart_items = db.query(CartItem).options(
            joinedload(CartItem.product).joinedload(Product.images)
        ).filter(CartItem.user_id == current_user.id).all()
    elif payload.session_id:
        cart_items = db.query(CartItem).options(
            joinedload(CartItem.product).joinedload(Product.images)
        ).filter(CartItem.session_id == payload.session_id).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No items or session found to place order"
        )

    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your shopping cart is empty"
        )

    # Validate stock and calculate authoritative total
    subtotal = 0.0
    order_items_to_create = []

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
        if not product or not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{item.product.name}' is no longer available"
            )
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.name}'. Only {product.stock_quantity} remaining."
            )

        # Deduct stock
        product.stock_quantity -= item.quantity
        line_subtotal = round(product.price * item.quantity, 2)
        subtotal += line_subtotal

        # Image thumbnail
        image_url = None
        if product.images:
            image_url = product.images[0].image_url

        order_items_to_create.append({
            "product_id": product.id,
            "product_name": product.name,
            "product_sku": product.sku,
            "product_image": image_url,
            "size": item.size,
            "color": item.color,
            "unit_price": product.price,
            "quantity": item.quantity,
            "subtotal": line_subtotal
        })

    subtotal = round(subtotal, 2)
    shipping_fee = 0.0 if subtotal >= settings.FREE_SHIPPING_THRESHOLD else settings.SHIPPING_FLAT_RATE
    total_amount = round(subtotal + shipping_fee, 2)

    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id if current_user else None,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email.lower(),
        customer_phone=payload.customer_phone,
        shipping_address=payload.shipping_address,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total_amount=total_amount,
        payment_method=payload.payment_method,
        payment_status="pending",
        order_status="pending",
        notes=payload.notes
    )
    db.add(order)
    db.flush()

    for oi in order_items_to_create:
        db_item = OrderItem(
            order_id=order.id,
            **oi
        )
        db.add(db_item)

    # Clear user's cart
    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order

@router.get("", response_model=List[OrderOut])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/{order_ref}", response_model=OrderOut)
def get_order_by_ref(
    order_ref: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    query = db.query(Order).options(joinedload(Order.items))
    if order_ref.isdigit():
        order = query.filter(Order.id == int(order_ref)).first()
    else:
        order = query.filter(Order.order_number == order_ref).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user and current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return order

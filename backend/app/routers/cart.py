from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from ..database import get_db
from ..models import CartItem, Product, User
from ..schemas import CartItemAdd, CartItemUpdate, CartSummaryOut
from ..auth import get_optional_user
from ..config import settings

router = APIRouter(prefix="/api/cart", tags=["Shopping Cart"])

def calculate_cart_summary(cart_items) -> CartSummaryOut:
    subtotal = sum(item.product.price * item.quantity for item in cart_items if item.product)
    subtotal = round(subtotal, 2)
    
    if subtotal == 0:
        shipping_fee = 0.0
    elif subtotal >= settings.FREE_SHIPPING_THRESHOLD:
        shipping_fee = 0.0
    else:
        shipping_fee = settings.SHIPPING_FLAT_RATE
        
    total = round(subtotal + shipping_fee, 2)
    item_count = sum(item.quantity for item in cart_items)
    
    return CartSummaryOut(
        items=cart_items,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        item_count=item_count
    )

@router.get("", response_model=CartSummaryOut)
def get_cart(
    session_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    query = db.query(CartItem).options(
        joinedload(CartItem.product).joinedload(Product.images),
        joinedload(CartItem.product).joinedload(Product.category)
    )

    if current_user:
        items = query.filter(CartItem.user_id == current_user.id).all()
    elif session_id:
        items = query.filter(CartItem.session_id == session_id).all()
    else:
        return CartSummaryOut(items=[], subtotal=0.0, shipping_fee=0.0, total=0.0, item_count=0)

    return calculate_cart_summary(items)

@router.post("/items", response_model=CartSummaryOut)
def add_to_cart(
    payload: CartItemAdd,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.stock_quantity < payload.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {product.stock_quantity} item(s) available in stock"
        )

    # Check for existing item with identical product, size, and color
    filter_args = [
        CartItem.product_id == payload.product_id,
        CartItem.size == payload.size,
        CartItem.color == payload.color
    ]
    if current_user:
        filter_args.append(CartItem.user_id == current_user.id)
    elif payload.session_id:
        filter_args.append(CartItem.session_id == payload.session_id)
    else:
        raise HTTPException(status_code=400, detail="Missing user or session_id")

    existing_item = db.query(CartItem).filter(*filter_args).first()

    if existing_item:
        new_qty = existing_item.quantity + payload.quantity
        if new_qty > product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add more than available stock ({product.stock_quantity})"
            )
        existing_item.quantity = new_qty
    else:
        new_item = CartItem(
            user_id=current_user.id if current_user else None,
            session_id=payload.session_id if not current_user else None,
            product_id=payload.product_id,
            size=payload.size,
            color=payload.color,
            quantity=payload.quantity
        )
        db.add(new_item)

    db.commit()

    # Re-fetch all items for summary
    return get_cart(session_id=payload.session_id, current_user=current_user, db=db)

@router.patch("/items/{item_id}", response_model=CartSummaryOut)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    session_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    # Verify authorization
    if current_user and item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    elif not current_user and item.session_id != session_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    if payload.quantity <= 0:
        db.delete(item)
    else:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product and payload.quantity > product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} available in stock"
            )
        item.quantity = payload.quantity

    db.commit()
    return get_cart(session_id=session_id, current_user=current_user, db=db)

@router.delete("/items/{item_id}", response_model=CartSummaryOut)
def remove_cart_item(
    item_id: int,
    session_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if current_user and item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    elif not current_user and item.session_id != session_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    db.delete(item)
    db.commit()
    return get_cart(session_id=session_id, current_user=current_user, db=db)

@router.delete("/clear")
def clear_cart(
    session_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    if current_user:
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    elif session_id:
        db.query(CartItem).filter(CartItem.session_id == session_id).delete()
    db.commit()
    return {"message": "Cart cleared"}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models import WishlistItem, Product, User
from ..schemas import WishlistItemOut, WishlistItemAdd
from ..auth import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[WishlistItemOut])
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(WishlistItem).options(
        joinedload(WishlistItem.product).joinedload(Product.images),
        joinedload(WishlistItem.product).joinedload(Product.category)
    ).filter(WishlistItem.user_id == current_user.id).order_by(WishlistItem.created_at.desc()).all()

@router.post("/items", response_model=WishlistItemOut, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(payload: WishlistItemAdd, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == payload.product_id
    ).first()
    if existing:
        return existing

    item = WishlistItem(user_id=current_user.id, product_id=payload.product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/items/{product_id}")
def remove_from_wishlist(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Item removed from wishlist"}

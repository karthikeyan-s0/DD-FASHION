from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Category, Product
from ..schemas import CategoryOut

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.display_order.asc(), Category.name.asc()).all()

@router.get("/{slug}", response_model=CategoryOut)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.slug == slug, Category.is_active == True).first()
    if not category:
        alt_slug = "kurtis" if slug == "kurtis-kurta-sets" else ("kurtis-kurta-sets" if slug == "kurtis" else None)
        if alt_slug:
            category = db.query(Category).filter(Category.slug == alt_slug, Category.is_active == True).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

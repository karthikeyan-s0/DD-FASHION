from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import NewsletterSubscriber
from ..schemas import NewsletterCreate

router = APIRouter(prefix="/api/newsletter", tags=["Newsletter"])

@router.post("/subscribe", status_code=status.HTTP_201_CREATED)
def subscribe(payload: NewsletterCreate, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).first()
    if existing:
        return {"message": "You are already subscribed to our DD FASHION newsletter!"}
    
    subscriber = NewsletterSubscriber(email=email)
    db.add(subscriber)
    db.commit()
    return {"message": "Thank you for subscribing to DD FASHION festive updates and new collections."}

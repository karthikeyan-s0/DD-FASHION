from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Address
from ..schemas import (
    UserCreate, UserLogin, UserOut, UserUpdate, Token,
    AddressCreate, AddressOut
)
from ..auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        phone=user_in.phone,
        role="customer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower()).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/logout")
def logout():
    # Stateless JWT logout
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(user_in: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.phone is not None:
        current_user.phone = user_in.phone
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/addresses", response_model=List[AddressOut])
def get_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.is_default.desc(), Address.id.desc()).all()

@router.post("/addresses", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def create_address(address_in: AddressCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if address_in.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    
    # If it's the first address, make it default automatically
    existing_count = db.query(Address).filter(Address.user_id == current_user.id).count()
    is_default = address_in.is_default or (existing_count == 0)

    address = Address(
        user_id=current_user.id,
        full_name=address_in.full_name,
        phone=address_in.phone,
        address_line1=address_line1 if (address_line1 := address_in.address_line1) else "",
        address_line2=address_in.address_line2,
        city=address_in.city,
        state=address_in.state,
        pincode=address_in.pincode,
        is_default=is_default
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.delete("/addresses/{address_id}")
def delete_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(address)
    db.commit()
    return {"message": "Address deleted successfully"}

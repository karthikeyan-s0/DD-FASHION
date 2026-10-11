from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# --- Address Schemas ---
class AddressBase(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressOut(AddressBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None
    parent_id: Optional[int] = None

class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# --- Product Image Schemas ---
class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    display_order: int = 0
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageOut(ProductImageBase):
    id: int

    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    slug: str
    sku: str
    description: Optional[str] = None
    category_id: int
    price: float
    compare_at_price: Optional[float] = None
    fabric: Optional[str] = None
    care_instructions: Optional[str] = None
    colors: List[str] = []
    sizes: List[str] = []
    stock_quantity: int = 10
    is_featured: bool = False
    is_new_arrival: bool = False
    is_active: bool = True
    tags: List[str] = []

class ProductCreate(ProductBase):
    images: List[ProductImageCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    fabric: Optional[str] = None
    care_instructions: Optional[str] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    stock_quantity: Optional[int] = None
    is_featured: Optional[bool] = None
    is_new_arrival: Optional[bool] = None
    is_active: Optional[bool] = None
    tags: Optional[List[str]] = None
    images: Optional[List[ProductImageCreate]] = None

class ProductOut(ProductBase):
    id: int
    category: Optional[CategoryOut] = None
    images: List[ProductImageOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    size: int
    pages: int

# --- Cart Schemas ---
class CartItemAdd(BaseModel):
    product_id: int
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int = 1
    session_id: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemOut(BaseModel):
    id: int
    product_id: int
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int
    created_at: datetime
    product: ProductOut

    class Config:
        from_attributes = True

class CartSummaryOut(BaseModel):
    items: List[CartItemOut]
    subtotal: float
    shipping_fee: float
    total: float
    item_count: int

# --- Wishlist Schemas ---
class WishlistItemAdd(BaseModel):
    product_id: int

class WishlistItemOut(BaseModel):
    id: int
    product_id: int
    created_at: datetime
    product: ProductOut

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    product_image: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: Dict[str, Any]
    payment_method: str = "cod"  # "cod", "online_razorpay", "whatsapp_direct"
    session_id: Optional[str] = None
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    order_status: Optional[str] = None
    payment_status: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    order_number: str
    user_id: Optional[int] = None
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: Dict[str, Any]
    subtotal: float
    shipping_fee: float
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True

# --- Admin Dashboard Stats ---
class AdminStatsOut(BaseModel):
    total_orders: int
    total_products: int
    pending_orders: int
    low_stock_products: int
    total_revenue: float
    recent_orders: List[OrderOut] = []

# --- Newsletter ---
class NewsletterCreate(BaseModel):
    email: EmailStr

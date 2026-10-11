import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .database import engine, Base
from .routers import auth, products, categories, cart, wishlist, orders, admin, newsletter

# Create database tables
Base.metadata.create_all(bind=engine)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend REST API for DD FASHION — Premium South Indian Women's Fashion Store"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local dev and production frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(newsletter.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "store": settings.STORE_NAME,
        "whatsapp_order_number": settings.WHATSAPP_NUMBER,
        "version": settings.VERSION
    }

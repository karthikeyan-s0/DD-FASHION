import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "DD FASHION API"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ddfashion_super_secret_jwt_key_2026_luxury_boutique_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dd_fashion.db")
    
    WHATSAPP_NUMBER: str = os.getenv("WHATSAPP_NUMBER", "919894251098")
    STORE_NAME: str = "DD FASHION"
    STORE_EMAIL: str = "contact@ddfashion.com"
    STORE_PHONE: str = "+91 98942 51098"
    
    SHIPPING_FLAT_RATE: float = 99.0
    FREE_SHIPPING_THRESHOLD: float = 1999.0
    COD_ENABLED: bool = True
    ONLINE_PAYMENT_ENABLED: bool = True
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "*"
    ]
    
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

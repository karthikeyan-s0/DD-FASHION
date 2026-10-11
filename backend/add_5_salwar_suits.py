import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Category, Product, ProductImage

def add_or_update_salwar_suits():
    db = SessionLocal()
    try:
        # Locate the existing Salwar Suits category
        category = db.query(Category).filter(
            (Category.slug == "salwar-suits") | (Category.name.like("%Salwar%"))
        ).first()

        if not category:
            print("Creating Salwar Suits category...")
            category = Category(
                name="Salwar Suits",
                slug="salwar-suits",
                description="Traditional Punjabi & South Indian style salwar suits, contemporary cape suits, and draped festive sets.",
                image_url="/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png",
                display_order=4,
                is_active=True
            )
            db.add(category)
            db.flush()
        else:
            print(f"Using existing category: {category.name} (ID: {category.id}, Slug: {category.slug})")
            # Update banner image to authentic photo
            category.image_url = "/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png"

        new_products = [
            {
                "name": "Ivory Draped Cowl Cape Salwar Suit",
                "slug": "ivory-draped-cowl-cape-salwar-suit",
                "sku": "DD-SAL-001",
                "price": 2499.0,
                "compare_at_price": 3199.0,
                "description": "A contemporary luxury salwar suit ensemble featuring an embellished crop blouse, fluid draped cowl-pleated dhoti salwar bottoms, and an attached sheer cape with delicate feather accents cascading from the shoulder. (Suggested Price: ₹2,499 — Pending Price Confirmation. Fabric & sizes to be confirmed).",
                "fabric": "Pending Verification (Georgette/Crepe blend style)",
                "care_instructions": "Dry clean only.",
                "colors": ["Ivory White", "Champagne"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 10,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["salwar suit", "cape suit", "ivory", "draped cowl", "festive", "pending-price"],
                "image_url": "/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png",
                "alt_text": "Ivory Draped Cowl Cape Salwar Suit with Embellished Crop Top and Feather Accent"
            },
            {
                "name": "Champagne Embroidered Cape Salwar Suit",
                "slug": "champagne-embroidered-cape-salwar-suit",
                "sku": "DD-SAL-002",
                "price": 2299.0,
                "compare_at_price": 2899.0,
                "description": "An ethereal three-piece ethnic cape suit combining an intricately embroidered sweetheart crop bustier, high-rise pleated front-draped salwar pants, and an open floor-sweeping sheer cape jacket with slit sleeves. (Suggested Price: ₹2,299 — Pending Price Confirmation. Fabric & sizes to be confirmed).",
                "fabric": "Pending Verification (Organza/Silk-blend style)",
                "care_instructions": "Dry clean recommended.",
                "colors": ["Champagne Cream"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 10,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["salwar suit", "cape jacket", "champagne", "embroidered", "partywear", "pending-price"],
                "image_url": "/images/products/salwar-suits/salwar_2_champagne_embroidered_cape.png",
                "alt_text": "Champagne Embroidered Cape Salwar Suit with Slit Sleeve Cape and Draped Pants"
            },
            {
                "name": "Mocha Taupe Ruffled Dhoti Cape Salwar Suit",
                "slug": "mocha-taupe-ruffled-dhoti-cape-salwar-suit",
                "sku": "DD-SAL-003",
                "price": 2699.0,
                "compare_at_price": 3499.0,
                "description": "A contemporary fusion salwar suit ensemble featuring an embroidered V-neck crop top with pearl-beaded fringe tassel hem, multi-tiered cascading ruffled dhoti salwar trousers, and an airy floor-length sheer cape jacket bordered with tonal embroidery. (Suggested Price: ₹2,699 — Pending Price Confirmation. Fabric & sizes to be confirmed).",
                "fabric": "Pending Verification (Georgette blend style)",
                "care_instructions": "Dry clean only.",
                "colors": ["Mocha Taupe"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 8,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["salwar suit", "ruffled dhoti", "cape suit", "taupe", "contemporary", "pending-price"],
                "image_url": "/images/products/salwar-suits/salwar_3_mocha_ruffled_dhoti_cape.png",
                "alt_text": "Mocha Taupe Ruffled Dhoti Cape Salwar Suit with Tassel Trim Crop Top"
            },
            {
                "name": "Dusty Rose Embroidered Cape Palazzo Salwar Suit",
                "slug": "dusty-rose-embroidered-cape-palazzo-salwar-suit",
                "sku": "DD-SAL-004",
                "price": 2599.0,
                "compare_at_price": 3299.0,
                "description": "A regal festive cape suit designed with a sweetheart neckline crop blouse adorned with fine floral zari and thread work, wide-leg fluid salwar palazzo pants, and an open sheer cape jacket bordered with scalloped embroidery. (Suggested Price: ₹2,599 — Pending Price Confirmation. Fabric & sizes to be confirmed).",
                "fabric": "Pending Verification (Chanderi/Silk blend style)",
                "care_instructions": "Dry clean recommended.",
                "colors": ["Dusty Rose", "Onion Pink"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 10,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["salwar suit", "palazzo suit", "cape", "dusty rose", "festive", "pending-price"],
                "image_url": "/images/products/salwar-suits/salwar_4_dusty_rose_embroidered_cape.png",
                "alt_text": "Dusty Rose Embroidered Cape Palazzo Salwar Suit with Floral Border"
            },
            {
                "name": "Rose Gold Shimmer Halter Salwar Suit",
                "slug": "rose-gold-shimmer-halter-salwar-suit",
                "sku": "DD-SAL-005",
                "price": 2899.0,
                "compare_at_price": 3699.0,
                "description": "A glamorous evening wear salwar suit ensemble featuring an ornate stone and sequin-embellished halter neck crop top, high-waisted fluid shimmer wide-leg palazzo salwar bottoms, and ruffled organza arm drapes. (Suggested Price: ₹2,899 — Pending Price Confirmation. Fabric & sizes to be confirmed).",
                "fabric": "Pending Verification (Tissue Shimmer / Silk blend style)",
                "care_instructions": "Dry clean only to maintain metallic shimmer and stone work.",
                "colors": ["Rose Gold", "Copper"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 8,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["salwar suit", "halter neck", "shimmer", "rose gold", "evening wear", "pending-price"],
                "image_url": "/images/products/salwar-suits/salwar_5_rose_gold_shimmer_halter.png",
                "alt_text": "Rose Gold Shimmer Halter Salwar Suit with Embellished Crop Top and Palazzo Pants"
            }
        ]

        for p_data in new_products:
            img_url = p_data.pop("image_url")
            alt_text = p_data.pop("alt_text")

            existing = db.query(Product).filter(Product.sku == p_data["sku"]).first()
            if existing:
                print(f"Updating existing product SKU: {p_data['sku']}")
                for k, v in p_data.items():
                    setattr(existing, k, v)
                existing.category_id = category.id
                
                if existing.images:
                    existing.images[0].image_url = img_url
                    existing.images[0].alt_text = alt_text
                else:
                    new_img = ProductImage(
                        product_id=existing.id,
                        image_url=img_url,
                        alt_text=alt_text,
                        display_order=0,
                        is_primary=True
                    )
                    db.add(new_img)
            else:
                print(f"Creating new product: {p_data['name']} (SKU: {p_data['sku']})")
                product = Product(
                    category_id=category.id,
                    **p_data
                )
                db.add(product)
                db.flush()

                p_img = ProductImage(
                    product_id=product.id,
                    image_url=img_url,
                    alt_text=alt_text,
                    display_order=0,
                    is_primary=True
                )
                db.add(p_img)

        db.commit()
        print("Successfully added/updated all 5 Salwar Suits products in the database!")

    except Exception as e:
        db.rollback()
        print(f"Error inserting products: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    add_or_update_salwar_suits()

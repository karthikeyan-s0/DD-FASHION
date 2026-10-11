import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Category, Product, ProductImage

def add_or_update_sarees():
    db = SessionLocal()
    try:
        # Locate the Sarees category
        category = db.query(Category).filter(Category.slug == "sarees").first()
        if not category:
            print("Category 'sarees' not found! Searching by name...")
            category = db.query(Category).filter(Category.name.like("%Saree%")).first()

        if not category:
            print("Creating Sarees category...")
            category = Category(
                name="Sarees",
                slug="sarees",
                description="Timeless Kanjeevarams, soft silks, temple border drapes, and lightweight everyday handloom cottons.",
                image_url="/images/products/sarees/saree_1_elegant_daily_wear.png",
                display_order=2,
                is_active=True
            )
            db.add(category)
            db.flush()
        else:
            # Update category banner image to use the new authentic photo
            category.image_url = "/images/products/sarees/saree_1_elegant_daily_wear.png"

        print(f"Using category: {category.name} (ID: {category.id})")

        new_products = [
            {
                "name": "Elegant Daily Wear Saree",
                "slug": "elegant-daily-wear-saree",
                "sku": "DD-SAR-001",
                "price": 699.0,
                "compare_at_price": 999.0,
                "description": "Simple, graceful saree suitable for everyday wear. Woven with a classic micro-check pattern across a deep wine maroon body, finished with a rich contrast bottle-green temple border and traditional gold motifs.",
                "fabric": "Cotton-Silk Blend (Fabric to be verified)",
                "care_instructions": "Hand wash in cold water with mild detergent. Dry in shade.",
                "colors": ["Wine Maroon", "Bottle Green"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 25,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["saree", "dailywear", "cotton silk", "temple border", "maroon", "bestseller"],
                "image_url": "/images/products/sarees/saree_1_elegant_daily_wear.png",
                "alt_text": "Elegant Daily Wear Saree in Deep Wine Maroon with Bottle Green Temple Border"
            },
            {
                "name": "Classic Traditional Saree",
                "slug": "classic-traditional-saree",
                "sku": "DD-SAR-002",
                "price": 999.0,
                "compare_at_price": 1399.0,
                "description": "A traditional look suitable for family gatherings and regular occasions. Draped in warm neutral biscuit-beige tones complemented by a vibrant mustard-yellow woven zari border and matching blouse.",
                "fabric": "Traditional Handloom-Feel Blend (Fabric to be verified)",
                "care_instructions": "Gentle hand wash or dry clean. Do not wring.",
                "colors": ["Warm Beige", "Mustard Yellow"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 20,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["saree", "traditional", "family occasion", "mustard", "beige"],
                "image_url": "/images/products/sarees/saree_2_classic_traditional.png",
                "alt_text": "Classic Traditional Saree in Warm Biscuit Beige with Mustard Yellow Zari Border"
            },
            {
                "name": "Premium Festive Saree",
                "slug": "premium-festive-saree",
                "sku": "DD-SAR-003",
                "price": 1499.0,
                "compare_at_price": 2199.0,
                "description": "An elegant festive option for celebrations and special occasions. Tailored in an enchanting dusty mauve lavender sheer organza drape adorned with delicate scalloped cutwork borders, floral embroidery, and an ornate designer blouse piece.",
                "fabric": "Sheer Organza-Style Blend (Fabric to be verified)",
                "care_instructions": "Dry clean only to preserve fine cutwork and embroidery.",
                "colors": ["Mauve Lavender", "Dusty Purple"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 15,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["saree", "festive", "partywear", "cutwork", "lavender", "organza"],
                "image_url": "/images/products/sarees/saree_3_premium_festive.png",
                "alt_text": "Premium Festive Saree in Dusty Mauve Lavender with Scalloped Cutwork Floral Embroidery"
            },
            {
                "name": "Graceful Printed Saree",
                "slug": "graceful-printed-saree",
                "sku": "DD-SAR-004",
                "price": 899.0,
                "compare_at_price": 1199.0,
                "description": "A stylish printed and woven look for everyday wear or casual outings. Showcases a refreshing mint seafoam green base with lustrous golden floral foliage motifs running along the border and pallu.",
                "fabric": "Soft Chiffon-Silk Blend (Fabric to be verified)",
                "care_instructions": "Hand wash cold or gentle machine cycle. Cool iron.",
                "colors": ["Mint Green", "Seafoam"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 18,
                "is_featured": False,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["saree", "printed", "mint green", "casual wear", "lightweight"],
                "image_url": "/images/products/sarees/saree_4_graceful_printed.png",
                "alt_text": "Graceful Printed Saree in Mint Seafoam Green with Golden Floral Border"
            },
            {
                "name": "Royal Occasion Wear Saree",
                "slug": "royal-occasion-wear-saree",
                "sku": "DD-SAR-005",
                "price": 1999.0,
                "compare_at_price": 2699.0,
                "description": "An elegant occasion-wear option for celebrations, weddings, and traditional ceremonies. Rich forest olive green fabric framed with regal broad golden zari borders and classic striped woven pallu with tassels.",
                "fabric": "Rich Handloom-Style Blend (Fabric to be verified)",
                "care_instructions": "Dry clean recommended for enduring sheen and zari longevity.",
                "colors": ["Forest Olive Green", "Golden Zari"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 12,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["saree", "royal occasion", "festive", "olive green", "zari border"],
                "image_url": "/images/products/sarees/saree_5_royal_occasion.png",
                "alt_text": "Royal Occasion Wear Saree in Deep Olive Green with Broad Golden Zari Border"
            }
        ]

        for p_data in new_products:
            img_url = p_data.pop("image_url")
            alt_text = p_data.pop("alt_text")

            # Check if product with this SKU already exists
            existing = db.query(Product).filter(Product.sku == p_data["sku"]).first()
            if existing:
                print(f"Updating existing product SKU: {p_data['sku']}")
                for k, v in p_data.items():
                    setattr(existing, k, v)
                existing.category_id = category.id
                
                # Check images
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
        print("Successfully added/updated all 5 Saree products in the database!")

    except Exception as e:
        db.rollback()
        print(f"Error inserting products: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    add_or_update_sarees()

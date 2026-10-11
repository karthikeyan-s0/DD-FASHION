import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Category, Product, ProductImage

def add_or_update_chudithars():
    db = SessionLocal()
    try:
        # Locate the Chudithar Sets category
        category = db.query(Category).filter(Category.slug == "chudithars").first()
        if not category:
            print("Category 'chudithars' not found! Searching by name...")
            category = db.query(Category).filter(Category.name.like("%Chudithar%")).first()

        if not category:
            print("Creating Chudithar Sets category...")
            category = Category(
                name="Chudithar Sets",
                slug="chudithars",
                description="Exquisite three-piece chudithar and salwar materials tailored in soft cottons, silks, and festive chanderi.",
                image_url="/images/products/chudithars/chudithar_1_elegant_everyday.jpg",
                display_order=1,
                is_active=True
            )
            db.add(category)
            db.flush()
        else:
            # Update category banner image to use the new authentic image
            category.image_url = "/images/products/chudithars/chudithar_1_elegant_everyday.jpg"

        print(f"Using category: {category.name} (ID: {category.id})")

        new_products = [
            {
                "name": "Elegant Everyday Chudithar Set",
                "slug": "elegant-everyday-chudithar-set",
                "sku": "DD-CHU-001",
                "price": 899.0,
                "compare_at_price": 1199.0,
                "description": "A stylish chudithar set for everyday wear, college, and casual outings. Tailored in a rich maroon flared silhouette with delicate golden yoke embroidery and matching trousers.",
                "fabric": "Rayon-Cotton Blend (Fabric to be verified)",
                "care_instructions": "Gentle hand wash cold. Dry in shade.",
                "colors": ["Deep Maroon", "Burgundy"],
                "sizes": ["S", "M", "L", "XL", "XXL"],
                "stock_quantity": 15,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["chudithar", "everyday", "casual", "maroon", "bestseller"],
                "image_url": "/images/products/chudithars/chudithar_1_elegant_everyday.jpg",
                "alt_text": "Elegant Everyday Chudithar Set in Deep Maroon with Golden Yoke Embroidery"
            },
            {
                "name": "Classic Traditional Chudithar Set",
                "slug": "classic-traditional-chudithar-set",
                "sku": "DD-CHU-002",
                "price": 1099.0,
                "compare_at_price": 1399.0,
                "description": "A traditional-inspired outfit suitable for family gatherings and everyday occasions. Features decorative front button placket and an ethnic printed contrast dupatta.",
                "fabric": "Cotton Blend (Fabric to be verified)",
                "care_instructions": "Hand wash with mild detergent.",
                "colors": ["Rust Maroon", "Terracotta"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 18,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["chudithar", "traditional", "printed dupatta", "family gatherings"],
                "image_url": "/images/products/chudithars/chudithar_2_classic_traditional.png",
                "alt_text": "Classic Traditional Chudithar Set with Printed Dupatta and Front Button Detailing"
            },
            {
                "name": "Premium Festive Chudithar Set",
                "slug": "premium-festive-chudithar-set",
                "sku": "DD-CHU-003",
                "price": 1499.0,
                "compare_at_price": 1899.0,
                "description": "An elegant outfit option for celebrations, festive gatherings, and special occasions. Showcases intricate floral embroidery along the scoop neckline and scalloped dupatta.",
                "fabric": "Chanderi-Style Blend (Fabric to be verified)",
                "care_instructions": "Dry clean recommended for first wash.",
                "colors": ["Rust Orange", "Terracotta Red"],
                "sizes": ["S", "M", "L", "XL"],
                "stock_quantity": 12,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["chudithar", "festive", "embroidered", "celebrations"],
                "image_url": "/images/products/chudithars/chudithar_3_premium_festive.png",
                "alt_text": "Premium Festive Chudithar Set in Terracotta Rust with Floral Embroidery"
            },
            {
                "name": "Graceful Cotton-Style Chudithar Set",
                "slug": "graceful-cotton-style-chudithar-set",
                "sku": "DD-CHU-004",
                "price": 799.0,
                "compare_at_price": 999.0,
                "description": "A versatile chudithar style for comfortable everyday fashion. Features geometric chevron yoke pattern on rich navy blue with matching dupatta. Confirm the actual fabric before publishing.",
                "fabric": "Cotton-Feel Blend (Fabric to be confirmed)",
                "care_instructions": "Machine wash cold gentle cycle.",
                "colors": ["Navy Blue", "Midnight Blue"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 20,
                "is_featured": False,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["chudithar", "cotton style", "navy", "dailywear"],
                "image_url": "/images/products/chudithars/chudithar_4_graceful_cotton.jpg",
                "alt_text": "Graceful Cotton-Style Chudithar Set in Navy Blue with Golden Chevron Yoke Pattern"
            },
            {
                "name": "Modern Ethnic Chudithar Set",
                "slug": "modern-ethnic-chudithar-set",
                "sku": "DD-CHU-005",
                "price": 1299.0,
                "compare_at_price": 1599.0,
                "description": "A contemporary ethnic outfit suitable for casual occasions and family events. Designed in refreshing sky blue with shimmering gold foil motifs and gathered churidar bottom.",
                "fabric": "Rayon Blend with Foil Work (Fabric to be verified)",
                "care_instructions": "Gentle hand wash inside out.",
                "colors": ["Sky Blue", "Pastel Blue"],
                "sizes": ["S", "M", "L", "XL"],
                "stock_quantity": 16,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["chudithar", "modern ethnic", "sky blue", "foil print"],
                "image_url": "/images/products/chudithars/chudithar_5_modern_ethnic.png",
                "alt_text": "Modern Ethnic Chudithar Set in Sky Blue with Gold Foil Prints and Churidar"
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
        print("Successfully added/updated all 5 Chudithar products in the database!")

    except Exception as e:
        db.rollback()
        print(f"Error inserting products: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    add_or_update_chudithars()

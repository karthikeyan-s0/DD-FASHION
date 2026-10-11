import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Category, Product, ProductImage

def add_or_update_kurtis():
    db = SessionLocal()
    try:
        # Locate or create the Kurtis & Kurta Sets category
        category = db.query(Category).filter(
            (Category.slug == "kurtis-kurta-sets") | (Category.slug == "kurtis") | (Category.name.like("%Kurti%"))
        ).first()

        if not category:
            print("Creating Kurtis & Kurta Sets category...")
            category = Category(
                name="Kurtis & Kurta Sets",
                slug="kurtis-kurta-sets",
                description="Chic everyday A-line kurtis, graceful printed sets, office wear, and festive paired kurta sets with matching dupattas and trousers.",
                image_url="/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png",
                display_order=3,
                is_active=True
            )
            db.add(category)
            db.flush()
        else:
            print(f"Found existing category ID: {category.id}, updating name & slug...")
            category.name = "Kurtis & Kurta Sets"
            category.slug = "kurtis-kurta-sets"
            category.description = "Chic everyday A-line kurtis, graceful printed sets, office wear, and festive paired kurta sets with matching dupattas and trousers."
            category.image_url = "/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png"
            category.display_order = 3
            category.is_active = True

        print(f"Using category: {category.name} (ID: {category.id}, Slug: {category.slug})")

        new_products = [
            {
                "name": "Elegant Everyday Kurti",
                "slug": "elegant-everyday-kurti",
                "sku": "DD-KKS-001",
                "price": 599.0,
                "compare_at_price": 899.0,
                "description": "A versatile everyday kurti and trousers combination suitable for college, casual outings, and daily wear. Features a delicate floral print across an ivory-white base with crochet lace border detailing on the hem and sleeves, paired with fuchsia pink pants. Unverified fabric blend; confirm specifications before publishing.",
                "fabric": "Cotton Blend (Fabric to be verified)",
                "care_instructions": "Gentle machine wash cold or hand wash with mild detergent.",
                "colors": ["Ivory White", "Fuchsia Pink"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 20,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["kurti", "everyday", "floral", "cotton blend", "college wear", "bestseller"],
                "image_url": "/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png",
                "alt_text": "Elegant Everyday Kurti & Pant Set in Ivory White and Fuchsia Pink Floral Print"
            },
            {
                "name": "Classic Printed Kurti",
                "slug": "classic-printed-kurti",
                "sku": "DD-KKS-002",
                "price": 799.0,
                "compare_at_price": 1199.0,
                "description": "A stylish printed flared kurta set for a comfortable and graceful everyday look. Showcases an all-over mustard yellow and turquoise teal ethnic print in an Anarkali silhouette, paired with a coordinating printed dupatta and bottoms. Unverified fabric blend; confirm specifications before publishing.",
                "fabric": "Cotton-Rayon Blend (Fabric to be verified)",
                "care_instructions": "Hand wash inside out with mild liquid detergent. Dry in shade.",
                "colors": ["Mustard Yellow", "Turquoise Teal"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 18,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["kurti", "printed", "anarkali", "mustard", "teal", "traditional"],
                "image_url": "/images/products/kurtis-kurta-sets/kurti_2_classic_printed.png",
                "alt_text": "Classic Printed Flared Kurta Set in Mustard Yellow and Turquoise Teal Print"
            },
            {
                "name": "Elegant Kurta Set",
                "slug": "elegant-kurta-set",
                "sku": "DD-KKS-003",
                "price": 1199.0,
                "compare_at_price": 1599.0,
                "description": "A coordinated ethnic outfit suitable for family gatherings and casual occasions. Crafted with a lively bright pink and orange floral botanical print in a flared Anarkali silhouette, complete with lace neckline detailing, matching trousers, and sheer dupatta. Unverified fabric blend; confirm specifications before publishing.",
                "fabric": "Chanderi / Georgette Style (Fabric to be verified)",
                "care_instructions": "Dry clean or gentle hand wash cold.",
                "colors": ["Vibrant Pink", "Marigold Orange"],
                "sizes": ["S", "M", "L", "XL"],
                "stock_quantity": 15,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["kurta set", "festive", "floral", "anarkali", "pink", "casual"],
                "image_url": "/images/products/kurtis-kurta-sets/kurti_3_elegant_kurta_set.jpg",
                "alt_text": "Elegant Flared Kurta Set in Vibrant Pink and Orange Floral Print with Dupatta"
            },
            {
                "name": "Premium Festive Kurta Set",
                "slug": "premium-festive-kurta-set",
                "sku": "DD-KKS-004",
                "price": 1599.0,
                "compare_at_price": 2199.0,
                "description": "An elegant ethnic outfit for celebrations and special occasions. Tailored with a graceful black straight-cut kurta featuring an embroidered neckline, straight black trousers, and a luxurious contrast magenta-pink woven festive dupatta bordered with golden zari and fringe tassels. Unverified fabric blend; confirm specifications before publishing.",
                "fabric": "Chanderi / Silk Blend (Fabric to be verified)",
                "care_instructions": "Dry clean recommended to protect delicate embroidery and woven dupatta.",
                "colors": ["Jet Black", "Magenta Pink"],
                "sizes": ["S", "M", "L", "XL", "XXL"],
                "stock_quantity": 12,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["kurta set", "festive", "embroidered", "black kurta", "banarasi dupatta", "celebration"],
                "image_url": "/images/products/kurtis-kurta-sets/kurti_4_premium_festive.png",
                "alt_text": "Premium Festive Black Kurta Set with Magenta Banarasi Style Zari Dupatta"
            },
            {
                "name": "Modern Ethnic Kurti Set",
                "slug": "modern-ethnic-kurti-set",
                "sku": "DD-KKS-005",
                "price": 999.0,
                "compare_at_price": 1399.0,
                "description": "A contemporary ethnic look suitable for outings and family events. Features a rich magenta pink straight-cut kurta highlighted with fine golden and silver yoke embroidery, paired with coordinating straight pants and matching lightweight dupatta. Unverified fabric blend; confirm specifications before publishing.",
                "fabric": "Rayon / Silk-Cotton Blend (Fabric to be verified)",
                "care_instructions": "Hand wash separately with mild detergent.",
                "colors": ["Deep Magenta", "Rani Pink"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 16,
                "is_featured": True,
                "is_new_arrival": True,
                "is_active": True,
                "tags": ["kurti set", "modern ethnic", "magenta", "embroidered yoke", "partywear"],
                "image_url": "/images/products/kurtis-kurta-sets/kurti_5_modern_ethnic.png",
                "alt_text": "Modern Ethnic Kurti Set in Deep Magenta Pink with Embroidered Neck Yoke"
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
        print("Successfully added/updated all 5 Kurtis & Kurta Sets products in the database!")

    except Exception as e:
        db.rollback()
        print(f"Error inserting products: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    add_or_update_kurtis()

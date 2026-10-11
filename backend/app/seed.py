import sys
import os

# Add parent directory to path so we can import app modules directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models import User, Category, Product, ProductImage
from app.auth import get_password_hash

def seed_database():
    print("Initializing DD FASHION database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Admin User
        admin_user = db.query(User).filter(User.email == "admin@ddfashion.com").first()
        if not admin_user:
            print("Creating Admin User...")
            admin_user = User(
                email="admin@ddfashion.com",
                hashed_password=get_password_hash("Admin@DDFashion2026"),
                full_name="DD Fashion Administrator",
                phone="+91 98942 51098",
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.flush()

        # 2. Store Categories (24 Categories)
        print("Synchronizing store categories...")
        categories_data = [
            {"id": 1, "name": "Chudithar Sets", "slug": "chudithars", "description": "Tailored three-piece everyday and festive chudithar ensembles.", "image_url": "/images/products/chudithars/chudithar_1_elegant_everyday.jpg", "display_order": 1},
            {"id": 2, "name": "Sarees", "slug": "sarees", "description": "Timeless Kanjeevarams, soft silks, temple border drapes, and handloom cottons.", "image_url": "/images/products/sarees/saree_1_elegant_daily_wear.png", "display_order": 2},
            {"id": 3, "name": "Kurtis & Kurta Sets", "slug": "kurtis-kurta-sets", "description": "A-line kurtis, printed paired sets with dupattas and pants.", "image_url": "/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png", "display_order": 3},
            {"id": 4, "name": "Salwar Suits", "slug": "salwar-suits", "description": "Traditional and contemporary cowl & cape salwar suits.", "image_url": "/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png", "display_order": 4},
            {"id": 5, "name": "Anarkali Suits", "slug": "anarkali-suits", "description": "Regal floor-length flared Anarkalis with fine embroidery.", "image_url": None, "display_order": 5},
            {"id": 6, "name": "Palazzo Sets", "slug": "palazzo-sets", "description": "Airy wide-leg palazzos paired with embellished kurtas.", "image_url": None, "display_order": 6},
            {"id": 7, "name": "Straight-Cut Suits", "slug": "straight-cut-suits", "description": "Classic straight-fit salwar suits for office and festive wear.", "image_url": None, "display_order": 7},
            {"id": 8, "name": "Leggings and Bottom Wear", "slug": "bottom-wear", "description": "Churidar leggings, cigarette pants, and salwar bottoms.", "image_url": None, "display_order": 8},
            {"id": 9, "name": "Blouses", "slug": "blouses", "description": "Bridal Aari work and ready-to-wear brocade saree blouses.", "image_url": None, "display_order": 9},
            {"id": 10, "name": "Half Sarees and Langa Davani", "slug": "half-sarees", "description": "Pure silk and pattu half saree drapes for young women.", "image_url": None, "display_order": 10},
            {"id": 11, "name": "Cotton Nighties", "slug": "cotton-nighties", "description": "Breathable combed pure cotton nightwear tailored for comfort.", "image_url": None, "display_order": 11},
            {"id": 12, "name": "Printed Nighties", "slug": "printed-nighties", "description": "Vibrant Jaipur and Coimbatore block printed cotton nighties.", "image_url": None, "display_order": 12},
            {"id": 13, "name": "Feeding Nighties", "slug": "feeding-nighties", "description": "Comfortable maternity and nursing nighties with concealed zippers.", "image_url": None, "display_order": 13},
            {"id": 14, "name": "House Dresses and Kaftans", "slug": "kaftans", "description": "Relaxed lounge kaftans with adjustable drawstrings.", "image_url": None, "display_order": 14},
            {"id": 15, "name": "Night Suits and Loungewear", "slug": "night-suits", "description": "Modal and cotton pyjama sets for relaxed sleepwear.", "image_url": None, "display_order": 15},
            {"id": 16, "name": "Wedding and Bridal Wear", "slug": "bridal-wear", "description": "Opulent Muhurtham silks and bridal trousseau collections.", "image_url": None, "display_order": 16},
            {"id": 17, "name": "Festive and Party Wear", "slug": "festive-wear", "description": "Glittering silhouettes for Diwali, Pongal, and festive gatherings.", "image_url": None, "display_order": 17},
            {"id": 18, "name": "Jewellery and Imitation Jewellery", "slug": "jewellery", "description": "Heritage matte gold and antique temple ornaments.", "image_url": None, "display_order": 18},
            {"id": 19, "name": "Earrings and Jhumkas", "slug": "jhumkas", "description": "South Indian Kemp stone bell jhumkas and chandbalis.", "image_url": None, "display_order": 19},
            {"id": 20, "name": "Bangles and Bracelets", "slug": "bangles", "description": "Antique finish peacock kada bangles and silk thread sets.", "image_url": None, "display_order": 20},
            {"id": 21, "name": "Necklaces and Chains", "slug": "necklaces", "description": "Kasu Malai coin chokers and Mango Malai long necklaces.", "image_url": None, "display_order": 21},
            {"id": 22, "name": "Hair Accessories", "slug": "hair-accessories", "description": "Traditional Jadai Billai sets and fresh flower veni pins.", "image_url": None, "display_order": 22},
            {"id": 23, "name": "Handbags and Clutches", "slug": "handbags", "description": "Raw silk zardozi potli bags and bridal box clutches.", "image_url": None, "display_order": 23},
            {"id": 24, "name": "Dupattas and Stoles", "slug": "dupattas", "description": "Banarasi Katan silk and hand-painted Kalamkari dupattas.", "image_url": None, "display_order": 24},
        ]

        cat_map = {}
        for cdata in categories_data:
            cat = db.query(Category).filter(Category.slug == cdata["slug"]).first()
            if not cat:
                cat = Category(**cdata)
                db.add(cat)
                db.flush()
            else:
                cat.image_url = cdata["image_url"]
            cat_map[cdata["slug"]] = cat.id

        db.commit()

        # 3. Real 20 Products (5 Chudithars, 5 Sarees, 5 Kurtis & Kurta Sets, 5 Salwar Suits)
        print("Checking real products...")
        real_products = [
            # Chudithars (DD-CHU-001 to 005)
            {
                "name": "Elegant Everyday Chudithar Set",
                "slug": "dd-chu-001-elegant-everyday-chudithar-set",
                "sku": "DD-CHU-001",
                "category_slug": "chudithars",
                "price": 899.0,
                "compare_at_price": 1199.0,
                "fabric": "Soft Cotton Blend",
                "care_instructions": "Machine wash gentle with similar colors. Line dry in shade.",
                "colors": ["Burgundy", "Navy Blue", "Mustard"],
                "sizes": ["S", "M", "L", "XL", "XXL"],
                "stock_quantity": 15,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["chudithar", "everyday", "cotton", "salwar"],
                "description": "A stylish chudithar set for everyday wear, college, and casual outings. Breathable fabric tailored for warm South Indian weather.",
                "images": ["/images/products/chudithars/chudithar_1_elegant_everyday.jpg"]
            },
            {
                "name": "Classic Traditional Chudithar Set",
                "slug": "dd-chu-002-classic-traditional-chudithar-set",
                "sku": "DD-CHU-002",
                "category_slug": "chudithars",
                "price": 1099.0,
                "compare_at_price": 1399.0,
                "fabric": "South Handloom Cotton",
                "care_instructions": "Hand wash cold separately. Mild detergent only.",
                "colors": ["Maroon", "Bottle Green", "Deep Teal"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 18,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["chudithar", "traditional", "handloom"],
                "description": "A traditional-inspired outfit suitable for family gatherings and everyday occasions. Adorned with delicate neck embroidery.",
                "images": ["/images/products/chudithars/chudithar_2_classic_traditional.png"]
            },
            {
                "name": "Premium Festive Chudithar Set",
                "slug": "dd-chu-003-premium-festive-chudithar-set",
                "sku": "DD-CHU-003",
                "category_slug": "chudithars",
                "price": 1499.0,
                "compare_at_price": 1899.0,
                "fabric": "Chanderi Silk with Cotton Lining",
                "care_instructions": "Dry clean recommended for first wash.",
                "colors": ["Wine Red", "Golden Ochre", "Peacock Blue"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 12,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["chudithar", "festive", "chanderi", "silk"],
                "description": "An elegant outfit option for celebrations, festive gatherings, and special occasions. Features ornate zari borders.",
                "images": ["/images/products/chudithars/chudithar_3_premium_festive.png"]
            },
            {
                "name": "Graceful Cotton-Style Chudithar Set",
                "slug": "dd-chu-004-graceful-cotton-style-chudithar-set",
                "sku": "DD-CHU-004",
                "category_slug": "chudithars",
                "price": 799.0,
                "compare_at_price": 999.0,
                "fabric": "100% Coimbatore Cotton",
                "care_instructions": "Machine wash cold. Warm iron while slightly damp.",
                "colors": ["Soft Rose", "Pastel Mint", "Warm Ivory"],
                "sizes": ["S", "M", "L", "XL"],
                "stock_quantity": 20,
                "is_featured": False,
                "is_new_arrival": True,
                "tags": ["chudithar", "cotton", "summer"],
                "description": "A comfortable and graceful choice for daily wear, office, and warm weather.",
                "images": ["/images/products/chudithars/chudithar_4_graceful_cotton_style.png"]
            },
            {
                "name": "Modern Ethnic Chudithar Set",
                "slug": "dd-chu-005-modern-ethnic-chudithar-set",
                "sku": "DD-CHU-005",
                "category_slug": "chudithars",
                "price": 1299.0,
                "compare_at_price": 1599.0,
                "fabric": "Rayon Modal with Foil Print Accents",
                "care_instructions": "Gentle hand wash inside out. Do not rub foil areas.",
                "colors": ["Dark Burgundy", "Dusty Pink", "Royal Indigo"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 16,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["chudithar", "modern", "ethnic"],
                "description": "A contemporary ethnic design suitable for functions, outings, and festive events.",
                "images": ["/images/products/chudithars/chudithar_5_modern_ethnic.png"]
            },

            # Sarees (DD-SAR-001 to 005)
            {
                "name": "Elegant Daily Wear Saree",
                "slug": "dd-sar-001-elegant-daily-wear-saree",
                "sku": "DD-SAR-001",
                "category_slug": "sarees",
                "price": 699.0,
                "compare_at_price": 899.0,
                "fabric": "Handloom Cotton",
                "care_instructions": "Gentle wash in cold water with mild liquid detergent.",
                "colors": ["Olive Green & Maroon", "Teal & Mustard", "Indigo Blue"],
                "sizes": ["Free Size (6.2m with blouse)"],
                "stock_quantity": 25,
                "is_featured": False,
                "is_new_arrival": True,
                "tags": ["saree", "daily-wear", "cotton"],
                "description": "Simple, graceful saree suitable for everyday wear, office, and temple visits. Made from breathable natural fibers.",
                "images": ["/images/products/sarees/saree_1_elegant_daily_wear.png"]
            },
            {
                "name": "Classic Traditional Saree",
                "slug": "dd-sar-002-classic-traditional-saree",
                "sku": "DD-SAR-002",
                "category_slug": "sarees",
                "price": 999.0,
                "compare_at_price": 1299.0,
                "fabric": "Semi-Silk with Korvai Border",
                "care_instructions": "Dry clean for longevity.",
                "colors": ["Deep Crimson & Gold", "Peacock Green & Purple"],
                "sizes": ["Free Size (6.2m with blouse)"],
                "stock_quantity": 20,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["saree", "traditional", "temple-border"],
                "description": "A traditional look suitable for family gatherings and regular occasions with an ornate South Indian pallu.",
                "images": ["/images/products/sarees/saree_2_classic_traditional.png"]
            },
            {
                "name": "Premium Festive Saree",
                "slug": "dd-sar-003-premium-festive-saree",
                "sku": "DD-SAR-003",
                "category_slug": "sarees",
                "price": 1499.0,
                "compare_at_price": 1999.0,
                "fabric": "Art Silk Kanjeevaram Weave",
                "care_instructions": "Dry clean only. Store in muslin cloth.",
                "colors": ["Royal Wine & Antique Zari", "Mustard & Maroon"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 15,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["saree", "festive", "zari"],
                "description": "An elegant festive option for celebrations, poojas, and weddings featuring metallic zari motifs.",
                "images": ["/images/products/sarees/saree_3_premium_festive.png"]
            },
            {
                "name": "Graceful Printed Saree",
                "slug": "dd-sar-004-graceful-printed-saree",
                "sku": "DD-SAR-004",
                "category_slug": "sarees",
                "price": 899.0,
                "compare_at_price": 1199.0,
                "fabric": "Mulmul Soft Cotton",
                "care_instructions": "Hand wash cold. Line dry in shade.",
                "colors": ["Floral Rose", "Jaipuri Indigo", "Earthy Taupe"],
                "sizes": ["Free Size (6.2m with blouse)"],
                "stock_quantity": 18,
                "is_featured": False,
                "is_new_arrival": True,
                "tags": ["saree", "printed", "mulmul"],
                "description": "A stylish printed look for everyday comfort, casual outings, and summer daytime elegance.",
                "images": ["/images/products/sarees/saree_4_graceful_printed.png"]
            },
            {
                "name": "Royal Occasion Wear Saree",
                "slug": "dd-sar-005-royal-occasion-wear-saree",
                "sku": "DD-SAR-005",
                "category_slug": "sarees",
                "price": 1999.0,
                "compare_at_price": 2599.0,
                "fabric": "Rich Brocade Soft Silk",
                "care_instructions": "Strictly dry clean only.",
                "colors": ["Burgundy & Antique Gold", "Emerald Green & Gold"],
                "sizes": ["Free Size (6.3m with blouse)"],
                "stock_quantity": 11,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["saree", "royal", "occasion-wear", "brocade"],
                "description": "An opulent occasion-wear saree featuring heavy all-over brocade weaving and an ornate golden pallu.",
                "images": ["/images/products/sarees/saree_5_royal_occasion_wear.png"]
            },

            # Kurtis & Kurta Sets (DD-KKS-001 to 005)
            {
                "name": "Elegant Everyday Kurti",
                "slug": "dd-kks-001-elegant-everyday-kurti",
                "sku": "DD-KKS-001",
                "category_slug": "kurtis-kurta-sets",
                "price": 599.0,
                "compare_at_price": 799.0,
                "fabric": "100% Breathable Cotton",
                "care_instructions": "Machine wash gentle. Line dry in shade.",
                "colors": ["Mustard Yellow", "Sky Blue", "Maroon"],
                "sizes": ["S", "M", "L", "XL", "XXL"],
                "stock_quantity": 20,
                "is_featured": False,
                "is_new_arrival": True,
                "tags": ["kurti", "everyday", "cotton"],
                "description": "A versatile everyday kurti suitable for college, casual outings, and daily wear with neat side slits.",
                "images": ["/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png"]
            },
            {
                "name": "Classic Printed Kurti",
                "slug": "dd-kks-002-classic-printed-kurti",
                "sku": "DD-KKS-002",
                "category_slug": "kurtis-kurta-sets",
                "price": 799.0,
                "compare_at_price": 999.0,
                "fabric": "Slub Rayon with Kalamkari Print",
                "care_instructions": "Hand wash cold. Do not bleach.",
                "colors": ["Indigo Blue", "Rust Orange", "Forest Green"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 18,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["kurti", "printed", "kalamkari"],
                "description": "A stylish printed kurti for a comfortable and graceful everyday look with three-quarter sleeves.",
                "images": ["/images/products/kurtis-kurta-sets/kurti_2_classic_printed.png"]
            },
            {
                "name": "Elegant Kurta Set",
                "slug": "dd-kks-003-elegant-kurta-set",
                "sku": "DD-KKS-003",
                "category_slug": "kurtis-kurta-sets",
                "price": 1199.0,
                "compare_at_price": 1499.0,
                "fabric": "Cotton Silk with Cotton Lining",
                "care_instructions": "Hand wash cold or dry clean.",
                "colors": ["Pastel Peach", "Mint Green", "Soft Lavender"],
                "sizes": ["S", "M", "L", "XL", "XXL"],
                "stock_quantity": 15,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["kurta-set", "ethnic", "trousers"],
                "description": "A coordinated ethnic outfit suitable for family gatherings and casual occasions with straight pants and chiffon dupatta.",
                "images": ["/images/products/kurtis-kurta-sets/kurti_3_elegant_kurta_set.png"]
            },
            {
                "name": "Premium Festive Kurta Set",
                "slug": "dd-kks-004-premium-festive-kurta-set",
                "sku": "DD-KKS-004",
                "category_slug": "kurtis-kurta-sets",
                "price": 1599.0,
                "compare_at_price": 1999.0,
                "fabric": "Chanderi Silk with Zari Embroidery",
                "care_instructions": "Dry clean recommended.",
                "colors": ["Wine Maroon", "Emerald Green", "Royal Navy"],
                "sizes": ["M", "L", "XL", "XXL"],
                "stock_quantity": 12,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["kurta-set", "festive", "chanderi", "embroidery"],
                "description": "An elegant ethnic outfit for celebrations and special occasions with rich neckline embroidery and matching silk trousers.",
                "images": ["/images/products/kurtis-kurta-sets/kurti_4_premium_festive_kurta_set.png"]
            },
            {
                "name": "Modern Ethnic Kurti Set",
                "slug": "dd-kks-005-modern-ethnic-kurti-set",
                "sku": "DD-KKS-005",
                "category_slug": "kurtis-kurta-sets",
                "price": 999.0,
                "compare_at_price": 1299.0,
                "fabric": "Soft Cotton Flex",
                "care_instructions": "Machine wash gentle. Warm iron.",
                "colors": ["Teal Blue", "Burgundy", "Warm Beige"],
                "sizes": ["S", "M", "L", "XL"],
                "stock_quantity": 16,
                "is_featured": False,
                "is_new_arrival": True,
                "tags": ["kurti-set", "modern", "ethnic", "palazzo"],
                "description": "A contemporary ethnic look suitable for outings and office wear with paired cropped trousers.",
                "images": ["/images/products/kurtis-kurta-sets/kurti_5_modern_ethnic_kurti_set.png"]
            },

            # Salwar Suits (DD-SAL-001 to 005)
            {
                "name": "Ivory Draped Cowl Cape Salwar Suit",
                "slug": "dd-sal-001-ivory-draped-cowl-cape-salwar-suit",
                "sku": "DD-SAL-001",
                "category_slug": "salwar-suits",
                "price": 2499.0,
                "compare_at_price": 3199.0,
                "fabric": "Georgette Silk with Intricate Threadwork",
                "care_instructions": "Dry clean only. Keep on padded hanger.",
                "colors": ["Ivory Cream with Gold"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 10,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["salwar-suit", "cape", "draped", "bridal", "pending-price"],
                "description": "Ivory draped cowl cape salwar suit featuring intricate embroidered floral motifs and an asymmetrical draped silhouette. *Suggested price: ₹2,499 (Pending Price Confirmation). Sizes: Pending Confirmation. Please verify with boutique administrator or inquire via WhatsApp for custom tailoring.",
                "images": ["/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png"]
            },
            {
                "name": "Champagne Embroidered Cape Salwar Suit",
                "slug": "dd-sal-002-champagne-embroidered-cape-salwar-suit",
                "sku": "DD-SAL-002",
                "category_slug": "salwar-suits",
                "price": 2299.0,
                "compare_at_price": 2899.0,
                "fabric": "Georgette Silk with Mirror Work",
                "care_instructions": "Dry clean only.",
                "colors": ["Champagne Beige with Gold"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 10,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["salwar-suit", "cape", "champagne", "festive", "pending-price"],
                "description": "Champagne embroidered cape salwar suit with floral bodice embroidery and full-length flowing sleeves. *Suggested price: ₹2,299 (Pending Price Confirmation). Sizes: Pending Confirmation. Please contact boutique assistant on WhatsApp to confirm custom measurements.",
                "images": ["/images/products/salwar-suits/salwar_2_champagne_embroidered_cape.png"]
            },
            {
                "name": "Mocha Taupe Ruffled Dhoti Cape Salwar Suit",
                "slug": "dd-sal-003-mocha-taupe-ruffled-dhoti-cape-salwar-suit",
                "sku": "DD-SAL-003",
                "category_slug": "salwar-suits",
                "price": 2699.0,
                "compare_at_price": 3499.0,
                "fabric": "Fine Crepe with Silk Georgette Cape",
                "care_instructions": "Dry clean only.",
                "colors": ["Mocha Taupe"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 8,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["salwar-suit", "dhoti", "ruffle", "cape", "pending-price"],
                "description": "Mocha taupe ruffled dhoti cape salwar suit with shoulder embellishments and a structured dhoti drape. *Suggested price: ₹2,699 (Pending Price Confirmation). Sizes: Pending Confirmation. Contact WhatsApp concierge for pre-order.",
                "images": ["/images/products/salwar-suits/salwar_3_mocha_taupe_ruffled_dhoti.png"]
            },
            {
                "name": "Dusty Rose Embroidered Cape Palazzo Salwar Suit",
                "slug": "dd-sal-004-dusty-rose-embroidered-cape-palazzo-salwar-suit",
                "sku": "DD-SAL-004",
                "category_slug": "salwar-suits",
                "price": 2599.0,
                "compare_at_price": 3299.0,
                "fabric": "Georgette Silk with Fine Cutdana & Sequins",
                "care_instructions": "Dry clean only.",
                "colors": ["Dusty Rose"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 10,
                "is_featured": True,
                "is_new_arrival": False,
                "tags": ["salwar-suit", "palazzo", "dusty-rose", "cape", "pending-price"],
                "description": "Dusty rose embroidered cape palazzo salwar suit with front-split sheer cape and wide palazzo trousers. *Suggested price: ₹2,599 (Pending Price Confirmation). Sizes: Pending Confirmation. Inquire on WhatsApp for tailoring options.",
                "images": ["/images/products/salwar-suits/salwar_4_dusty_rose_embroidered_cape.png"]
            },
            {
                "name": "Rose Gold Shimmer Halter Salwar Suit",
                "slug": "dd-sal-005-rose-gold-shimmer-halter-salwar-suit",
                "sku": "DD-SAL-005",
                "category_slug": "salwar-suits",
                "price": 2899.0,
                "compare_at_price": 3699.0,
                "fabric": "Metallic Threaded Chiffon with Heavy Zari",
                "care_instructions": "Strictly dry clean only.",
                "colors": ["Rose Gold"],
                "sizes": ["Pending Confirmation"],
                "stock_quantity": 6,
                "is_featured": True,
                "is_new_arrival": True,
                "tags": ["salwar-suit", "rose-gold", "halter", "cape", "pending-price"],
                "description": "Rose gold shimmer halter salwar suit with high-shine metallic embroidery and flowing split cape. *Suggested price: ₹2,899 (Pending Price Confirmation). Sizes: Pending Confirmation. Confirm price and dimensions directly on WhatsApp.",
                "images": ["/images/products/salwar-suits/salwar_5_rose_gold_shimmer_halter.png"]
            },
        ]

        for pdata in real_products:
            sku = pdata["sku"]
            existing = db.query(Product).filter(Product.sku == sku).first()
            if not existing:
                cat_id = cat_map.get(pdata["category_slug"], 1)
                img_urls = pdata.pop("images", [])
                pdata.pop("category_slug", None)
                pdata["category_id"] = cat_id
                prod = Product(**pdata)
                db.add(prod)
                db.flush()

                for idx, url in enumerate(img_urls):
                    p_img = ProductImage(
                        product_id=prod.id,
                        image_url=url,
                        alt_text=prod.name,
                        display_order=idx,
                        is_primary=(idx == 0)
                    )
                    db.add(p_img)

        db.commit()
        print(f"Successfully seeded database with {len(real_products)} verified products!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

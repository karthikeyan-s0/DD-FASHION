-- =====================================================================
-- DD FASHION — Supabase Production Database Schema & Security Policies
-- South Indian Women's Fashion E-Commerce Platform
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Drop (if re-running)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- =====================================================================
-- 3. Users Table (Aligned with Supabase Auth or Custom JWT)
-- =====================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- =====================================================================
-- 4. Categories Table
-- =====================================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- =====================================================================
-- 5. Products Table
-- =====================================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
    fabric VARCHAR(255),
    care_instructions TEXT,
    colors JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    stock_quantity INT DEFAULT 10 CHECK (stock_quantity >= 0),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_new ON products(is_new_arrival);

-- =====================================================================
-- 6. Product Images Table
-- =====================================================================
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =====================================================================
-- 7. Customer Addresses Table
-- =====================================================================
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- =====================================================================
-- 8. Shopping Cart Items Table
-- =====================================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);

-- =====================================================================
-- 9. Wishlist Items Table
-- =====================================================================
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_product_wishlist UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

-- =====================================================================
-- 10. Orders Table
-- =====================================================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) DEFAULT 0.0 CHECK (shipping_fee >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cod', 'online', 'whatsapp')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =====================================================================
-- 11. Order Items Table
-- =====================================================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    product_image VARCHAR(500),
    size VARCHAR(50),
    color VARCHAR(50),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================================
-- 12. Newsletter Subscribers
-- =====================================================================
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 13. Row Level Security (RLS) Policies
-- =====================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Categories: Public read active categories, Admins full access
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins have full access to categories" ON categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Products: Public read active products, Admins full access
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins have full access to products" ON products
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Product Images: Public read, Admins manage
CREATE POLICY "Public can view product images" ON product_images
    FOR SELECT USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = TRUE));

CREATE POLICY "Admins have full access to product images" ON product_images
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Cart Items: Users manage their own cart, service_role manages all
CREATE POLICY "Users can manage own cart items" ON cart_items
    FOR ALL USING (
        user_id = (auth.jwt() ->> 'sub')::int 
        OR session_id IS NOT NULL
        OR auth.role() = 'service_role'
    );

-- Wishlist Items: Users manage their own wishlist
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
    FOR ALL USING (
        user_id = (auth.jwt() ->> 'sub')::int 
        OR auth.role() = 'service_role'
    );

-- Orders: Users view their own orders, Admins view and update all
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        user_id = (auth.jwt() ->> 'sub')::int 
        OR auth.jwt() ->> 'role' = 'admin'
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' 
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Public can insert orders" ON orders
    FOR INSERT WITH CHECK (TRUE);

-- Order Items: Viewable if order is viewable
CREATE POLICY "Users view items of their orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = (auth.jwt() ->> 'sub')::int OR auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
        )
    );

CREATE POLICY "Service can insert order items" ON order_items
    FOR INSERT WITH CHECK (TRUE);

-- Newsletter: Public can subscribe
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins view subscribers" ON newsletter_subscribers
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- =====================================================================
-- 14. SEED DATA — 24 Real Categories & 20 Verified User Products
-- =====================================================================

-- Admin User (Password: Admin@DDFashion2026 - bcrypt hash)
INSERT INTO users (email, hashed_password, full_name, phone, role) VALUES 
('admin@ddfashion.com', '$2b$12$jQjZgO3dF7Q10E23wD4Gae4Nl7hS/4W8gW6M18k2hKqY9YF6L8c1S', 'DD Fashion Boutique Admin', '+91 98942 51098', 'admin');

-- Categories (Real boutique collections)
INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES
(1, 'Chudithar Sets', 'chudithars', 'Tailored three-piece everyday and festive chudithar ensembles.', '/images/products/chudithars/chudithar_1_elegant_everyday.jpg', 1),
(2, 'Sarees', 'sarees', 'Timeless Kanjeevarams, soft silks, temple border drapes, and handloom cottons.', '/images/products/sarees/saree_1_elegant_daily_wear.png', 2),
(3, 'Kurtis & Kurta Sets', 'kurtis-kurta-sets', 'A-line kurtis, printed paired sets with dupattas and pants.', '/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png', 3),
(4, 'Salwar Suits', 'salwar-suits', 'Traditional and contemporary cowl & cape salwar suits.', '/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png', 4),
(5, 'Anarkali Suits', 'anarkali-suits', 'Regal floor-length flared Anarkalis with fine embroidery.', NULL, 5),
(6, 'Palazzo Sets', 'palazzo-sets', 'Airy wide-leg palazzos paired with embellished kurtas.', NULL, 6),
(7, 'Straight-Cut Suits', 'straight-cut-suits', 'Classic straight-fit salwar suits for office and festive wear.', NULL, 7),
(8, 'Leggings and Bottom Wear', 'bottom-wear', 'Churidar leggings, cigarette pants, and salwar bottoms.', NULL, 8),
(9, 'Blouses', 'blouses', 'Bridal Aari work and ready-to-wear brocade saree blouses.', NULL, 9),
(10, 'Half Sarees and Langa Davani', 'half-sarees', 'Pure silk and pattu half saree drapes for teenage and young women.', NULL, 10),
(11, 'Cotton Nighties', 'cotton-nighties', 'Breathable combed pure cotton nightwear tailored for comfort.', NULL, 11),
(12, 'Printed Nighties', 'printed-nighties', 'Vibrant Jaipur and Coimbatore block printed cotton nighties.', NULL, 12),
(13, 'Feeding Nighties', 'feeding-nighties', 'Comfortable maternity and nursing nighties with concealed zippers.', NULL, 13),
(14, 'House Dresses and Kaftans', 'kaftans', 'Relaxed lounge kaftans with adjustable drawstrings.', NULL, 14),
(15, 'Night Suits and Loungewear', 'night-suits', 'Modal and cotton pyjama sets for relaxed sleepwear.', NULL, 15),
(16, 'Wedding and Bridal Wear', 'bridal-wear', 'Opulent Muhurtham silks and bridal trousseau collections.', NULL, 16),
(17, 'Festive and Party Wear', 'festive-wear', 'Glittering silhouettes for Diwali, Pongal, and festive gatherings.', NULL, 17),
(18, 'Jewellery and Imitation Jewellery', 'jewellery', 'Heritage matte gold and antique temple ornaments.', NULL, 18),
(19, 'Earrings and Jhumkas', 'jhumkas', 'South Indian Kemp stone bell jhumkas and chandbalis.', NULL, 19),
(20, 'Bangles and Bracelets', 'bangles', 'Antique finish peacock kada bangles and silk thread sets.', NULL, 20),
(21, 'Necklaces and Chains', 'necklaces', 'Kasu Malai coin chokers and Mango Malai long necklaces.', NULL, 21),
(22, 'Hair Accessories', 'hair-accessories', 'Traditional Jadai Billai sets and fresh flower veni pins.', NULL, 22),
(23, 'Handbags and Clutches', 'handbags', 'Raw silk zardozi potli bags and bridal box clutches.', NULL, 23),
(24, 'Dupattas and Stoles', 'dupattas', 'Banarasi Katan silk and hand-painted Kalamkari dupattas.', NULL, 24);

-- Reset sequence for categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Real Products: 5 Chudithars (DD-CHU-001 to 005)
INSERT INTO products (name, slug, sku, category_id, price, compare_at_price, fabric, care_instructions, colors, sizes, stock_quantity, is_featured, is_new_arrival, is_active, tags, description) VALUES
('Elegant Everyday Chudithar Set', 'dd-chu-001-elegant-everyday-chudithar-set', 'DD-CHU-001', 1, 899.0, 1199.0, 'Soft Cotton Blend', 'Machine wash gentle with similar colors. Line dry in shade.', '["Burgundy", "Navy Blue", "Mustard"]'::jsonb, '["S", "M", "L", "XL", "XXL"]'::jsonb, 15, true, true, true, '["chudithar", "everyday", "cotton", "salwar"]'::jsonb, 'A stylish chudithar set for everyday wear, college, and casual outings. Breathable fabric tailored for warm South Indian weather.'),
('Classic Traditional Chudithar Set', 'dd-chu-002-classic-traditional-chudithar-set', 'DD-CHU-002', 1, 1099.0, 1399.0, 'South Handloom Cotton', 'Hand wash cold separately. Mild detergent only.', '["Maroon", "Bottle Green", "Deep Teal"]'::jsonb, '["M", "L", "XL", "XXL"]'::jsonb, 18, true, false, true, '["chudithar", "traditional", "handloom"]'::jsonb, 'A traditional-inspired outfit suitable for family gatherings and everyday occasions. Adorned with delicate neck embroidery.'),
('Premium Festive Chudithar Set', 'dd-chu-003-premium-festive-chudithar-set', 'DD-CHU-003', 1, 1499.0, 1899.0, 'Chanderi Silk with Cotton Lining', 'Dry clean recommended for first wash.', '["Wine Red", "Golden Ochre", "Peacock Blue"]'::jsonb, '["M", "L", "XL", "XXL"]'::jsonb, 12, true, true, true, '["chudithar", "festive", "chanderi", "silk"]'::jsonb, 'An elegant outfit option for celebrations, festive gatherings, and special occasions. Features ornate zari borders.'),
('Graceful Cotton-Style Chudithar Set', 'dd-chu-004-graceful-cotton-style-chudithar-set', 'DD-CHU-004', 1, 799.0, 999.0, '100% Coimbatore Cotton', 'Machine wash cold. Warm iron while slightly damp.', '["Soft Rose", "Pastel Mint", "Warm Ivory"]'::jsonb, '["S", "M", "L", "XL"]'::jsonb, 20, false, true, true, '["chudithar", "cotton", "summer"]'::jsonb, 'A comfortable and graceful choice for daily wear, office, and warm weather.'),
('Modern Ethnic Chudithar Set', 'dd-chu-005-modern-ethnic-chudithar-set', 'DD-CHU-005', 1, 1299.0, 1599.0, 'Rayon Modal with Foil Print Accents', 'Gentle hand wash inside out. Do not rub foil areas.', '["Dark Burgundy", "Dusty Pink", "Royal Indigo"]'::jsonb, '["M", "L", "XL", "XXL"]'::jsonb, 16, true, false, true, '["chudithar", "modern", "ethnic"]'::jsonb, 'A contemporary ethnic design suitable for functions, outings, and festive events.');

-- Real Products: 5 Sarees (DD-SAR-001 to 005)
INSERT INTO products (name, slug, sku, category_id, price, compare_at_price, fabric, care_instructions, colors, sizes, stock_quantity, is_featured, is_new_arrival, is_active, tags, description) VALUES
('Elegant Daily Wear Saree', 'dd-sar-001-elegant-daily-wear-saree', 'DD-SAR-001', 2, 699.0, 899.0, 'Handloom Cotton', 'Gentle wash in cold water with mild liquid detergent.', '["Olive Green & Maroon", "Teal & Mustard", "Indigo Blue"]'::jsonb, '["Free Size (6.2m with blouse)"]'::jsonb, 25, false, true, true, '["saree", "daily-wear", "cotton"]'::jsonb, 'Simple, graceful saree suitable for everyday wear, office, and temple visits. Made from breathable natural fibers.'),
('Classic Traditional Saree', 'dd-sar-002-classic-traditional-saree', 'DD-SAR-002', 2, 999.0, 1299.0, 'Semi-Silk with Korvai Border', 'Dry clean for longevity.', '["Deep Crimson & Gold", "Peacock Green & Purple"]'::jsonb, '["Free Size (6.2m with blouse)"]'::jsonb, 20, true, false, true, '["saree", "traditional", "temple-border"]'::jsonb, 'A traditional look suitable for family gatherings and regular occasions with an ornate South Indian pallu.'),
('Premium Festive Saree', 'dd-sar-003-premium-festive-saree', 'DD-SAR-003', 2, 1499.0, 1999.0, 'Art Silk Kanjeevaram Weave', 'Dry clean only. Store in muslin cloth.', '["Royal Wine & Antique Zari", "Mustard & Maroon"]'::jsonb, '["Free Size (6.3m with blouse)"]'::jsonb, 15, true, true, true, '["saree", "festive", "zari"]'::jsonb, 'An elegant festive option for celebrations, poojas, and weddings featuring metallic zari motifs.'),
('Graceful Printed Saree', 'dd-sar-004-graceful-printed-saree', 'DD-SAR-004', 2, 899.0, 1199.0, 'Mulmul Soft Cotton', 'Hand wash cold. Line dry in shade.', '["Floral Rose", "Jaipuri Indigo", "Earthy Taupe"]'::jsonb, '["Free Size (6.2m with blouse)"]'::jsonb, 18, false, true, true, '["saree", "printed", "mulmul"]'::jsonb, 'A stylish printed look for everyday comfort, casual outings, and summer daytime elegance.'),
('Royal Occasion Wear Saree', 'dd-sar-005-royal-occasion-wear-saree', 'DD-SAR-005', 2, 1999.0, 2599.0, 'Rich Brocade Soft Silk', 'Strictly dry clean only.', '["Burgundy & Antique Gold", "Emerald Green & Gold"]'::jsonb, '["Free Size (6.3m with blouse)"]'::jsonb, 11, true, false, true, '["saree", "royal", "occasion-wear", "brocade"]'::jsonb, 'An opulent occasion-wear saree featuring heavy all-over brocade weaving and an ornate golden pallu.');

-- Real Products: 5 Kurtis & Kurta Sets (DD-KKS-001 to 005)
INSERT INTO products (name, slug, sku, category_id, price, compare_at_price, fabric, care_instructions, colors, sizes, stock_quantity, is_featured, is_new_arrival, is_active, tags, description) VALUES
('Elegant Everyday Kurti', 'dd-kks-001-elegant-everyday-kurti', 'DD-KKS-001', 3, 599.0, 799.0, '100% Breathable Cotton', 'Machine wash gentle. Line dry in shade.', '["Mustard Yellow", "Sky Blue", "Maroon"]'::jsonb, '["S", "M", "L", "XL", "XXL"]'::jsonb, 20, false, true, true, '["kurti", "everyday", "cotton"]'::jsonb, 'A versatile everyday kurti suitable for college, casual outings, and daily wear with neat side slits.'),
('Classic Printed Kurti', 'dd-kks-002-classic-printed-kurti', 'DD-KKS-002', 3, 799.0, 999.0, 'Slub Rayon with Kalamkari Print', 'Hand wash cold. Do not bleach.', '["Indigo Blue", "Rust Orange", "Forest Green"]'::jsonb, '["M", "L", "XL", "XXL"]'::jsonb, 18, true, false, true, '["kurti", "printed", "kalamkari"]'::jsonb, 'A stylish printed kurti for a comfortable and graceful everyday look with three-quarter sleeves.'),
('Elegant Kurta Set', 'dd-kks-003-elegant-kurta-set', 'DD-KKS-003', 3, 1199.0, 1499.0, 'Cotton Silk with Cotton Lining', 'Hand wash cold or dry clean.', '["Pastel Peach", "Mint Green", "Soft Lavender"]'::jsonb, '["S", "M", "L", "XL", "XXL"]'::jsonb, 15, true, true, true, '["kurta-set", "ethnic", "trousers"]'::jsonb, 'A coordinated ethnic outfit suitable for family gatherings and casual occasions with straight pants and chiffon dupatta.'),
('Premium Festive Kurta Set', 'dd-kks-004-premium-festive-kurta-set', 'DD-KKS-004', 3, 1599.0, 1999.0, 'Chanderi Silk with Zari Embroidery', 'Dry clean recommended.', '["Wine Maroon", "Emerald Green", "Royal Navy"]'::jsonb, '["M", "L", "XL", "XXL"]'::jsonb, 12, true, false, true, '["kurta-set", "festive", "chanderi", "embroidery"]'::jsonb, 'An elegant ethnic outfit for celebrations and special occasions with rich neckline embroidery and matching silk trousers.'),
('Modern Ethnic Kurti Set', 'dd-kks-005-modern-ethnic-kurti-set', 'DD-KKS-005', 3, 999.0, 1299.0, 'Soft Cotton Flex', 'Machine wash gentle. Warm iron.', '["Teal Blue", "Burgundy", "Warm Beige"]'::jsonb, '["S", "M", "L", "XL"]'::jsonb, 16, false, true, true, '["kurti-set", "modern", "ethnic", "palazzo"]'::jsonb, 'A contemporary ethnic look suitable for outings and office wear with paired cropped trousers.');

-- Real Products: 5 Salwar Suits (DD-SAL-001 to 005)
INSERT INTO products (name, slug, sku, category_id, price, compare_at_price, fabric, care_instructions, colors, sizes, stock_quantity, is_featured, is_new_arrival, is_active, tags, description) VALUES
('Ivory Draped Cowl Cape Salwar Suit', 'dd-sal-001-ivory-draped-cowl-cape-salwar-suit', 'DD-SAL-001', 4, 2499.0, 3199.0, 'Georgette Silk with Intricate Threadwork', 'Dry clean only. Keep on padded hanger.', '["Ivory Cream with Gold"]'::jsonb, '["Pending Confirmation"]'::jsonb, 10, true, true, true, '["salwar-suit", "cape", "draped", "bridal", "pending-price"]'::jsonb, 'Ivory draped cowl cape salwar suit featuring intricate embroidered floral motifs and an asymmetrical draped silhouette. *Suggested price: ₹2,499 (Pending Price Confirmation). Sizes: Pending Confirmation. Please verify with boutique administrator or inquire via WhatsApp for custom tailoring.'),
('Champagne Embroidered Cape Salwar Suit', 'dd-sal-002-champagne-embroidered-cape-salwar-suit', 'DD-SAL-002', 4, 2299.0, 2899.0, 'Georgette Silk with Mirror Work', 'Dry clean only.', '["Champagne Beige with Gold"]'::jsonb, '["Pending Confirmation"]'::jsonb, 10, true, false, true, '["salwar-suit", "cape", "champagne", "festive", "pending-price"]'::jsonb, 'Champagne embroidered cape salwar suit with floral bodice embroidery and full-length flowing sleeves. *Suggested price: ₹2,299 (Pending Price Confirmation). Sizes: Pending Confirmation. Please contact boutique assistant on WhatsApp to confirm custom measurements.'),
('Mocha Taupe Ruffled Dhoti Cape Salwar Suit', 'dd-sal-003-mocha-taupe-ruffled-dhoti-cape-salwar-suit', 'DD-SAL-003', 4, 2699.0, 3499.0, 'Fine Crepe with Silk Georgette Cape', 'Dry clean only.', '["Mocha Taupe"]'::jsonb, '["Pending Confirmation"]'::jsonb, 8, true, true, true, '["salwar-suit", "dhoti", "ruffle", "cape", "pending-price"]'::jsonb, 'Mocha taupe ruffled dhoti cape salwar suit with shoulder embellishments and a structured dhoti drape. *Suggested price: ₹2,699 (Pending Price Confirmation). Sizes: Pending Confirmation. Contact WhatsApp concierge for pre-order.'),
('Dusty Rose Embroidered Cape Palazzo Salwar Suit', 'dd-sal-004-dusty-rose-embroidered-cape-palazzo-salwar-suit', 'DD-SAL-004', 4, 2599.0, 3299.0, 'Georgette Silk with Fine Cutdana & Sequins', 'Dry clean only.', '["Dusty Rose"]'::jsonb, '["Pending Confirmation"]'::jsonb, 10, true, false, true, '["salwar-suit", "palazzo", "dusty-rose", "cape", "pending-price"]'::jsonb, 'Dusty rose embroidered cape palazzo salwar suit with front-split sheer cape and wide palazzo trousers. *Suggested price: ₹2,599 (Pending Price Confirmation). Sizes: Pending Confirmation. Inquire on WhatsApp for tailoring options.'),
('Rose Gold Shimmer Halter Salwar Suit', 'dd-sal-005-rose-gold-shimmer-halter-salwar-suit', 'DD-SAL-005', 4, 2899.0, 3699.0, 'Metallic Threaded Chiffon with Heavy Zari', 'Strictly dry clean only.', '["Rose Gold"]'::jsonb, '["Pending Confirmation"]'::jsonb, 6, true, true, true, '["salwar-suit", "rose-gold", "halter", "cape", "pending-price"]'::jsonb, 'Rose gold shimmer halter salwar suit with high-shine metallic embroidery and flowing split cape. *Suggested price: ₹2,899 (Pending Price Confirmation). Sizes: Pending Confirmation. Confirm price and dimensions directly on WhatsApp.');

-- Product Images mapping to local public directory
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
((SELECT id FROM products WHERE sku='DD-CHU-001'), '/images/products/chudithars/chudithar_1_elegant_everyday.jpg', 'Elegant Everyday Chudithar Set', 0, true),
((SELECT id FROM products WHERE sku='DD-CHU-002'), '/images/products/chudithars/chudithar_2_classic_traditional.png', 'Classic Traditional Chudithar Set', 0, true),
((SELECT id FROM products WHERE sku='DD-CHU-003'), '/images/products/chudithars/chudithar_3_premium_festive.png', 'Premium Festive Chudithar Set', 0, true),
((SELECT id FROM products WHERE sku='DD-CHU-004'), '/images/products/chudithars/chudithar_4_graceful_cotton_style.png', 'Graceful Cotton-Style Chudithar Set', 0, true),
((SELECT id FROM products WHERE sku='DD-CHU-005'), '/images/products/chudithars/chudithar_5_modern_ethnic.png', 'Modern Ethnic Chudithar Set', 0, true),

((SELECT id FROM products WHERE sku='DD-SAR-001'), '/images/products/sarees/saree_1_elegant_daily_wear.png', 'Elegant Daily Wear Saree', 0, true),
((SELECT id FROM products WHERE sku='DD-SAR-002'), '/images/products/sarees/saree_2_classic_traditional.png', 'Classic Traditional Saree', 0, true),
((SELECT id FROM products WHERE sku='DD-SAR-003'), '/images/products/sarees/saree_3_premium_festive.png', 'Premium Festive Saree', 0, true),
((SELECT id FROM products WHERE sku='DD-SAR-004'), '/images/products/sarees/saree_4_graceful_printed.png', 'Graceful Printed Saree', 0, true),
((SELECT id FROM products WHERE sku='DD-SAR-005'), '/images/products/sarees/saree_5_royal_occasion_wear.png', 'Royal Occasion Wear Saree', 0, true),

((SELECT id FROM products WHERE sku='DD-KKS-001'), '/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png', 'Elegant Everyday Kurti', 0, true),
((SELECT id FROM products WHERE sku='DD-KKS-002'), '/images/products/kurtis-kurta-sets/kurti_2_classic_printed.png', 'Classic Printed Kurti', 0, true),
((SELECT id FROM products WHERE sku='DD-KKS-003'), '/images/products/kurtis-kurta-sets/kurti_3_elegant_kurta_set.png', 'Elegant Kurta Set', 0, true),
((SELECT id FROM products WHERE sku='DD-KKS-004'), '/images/products/kurtis-kurta-sets/kurti_4_premium_festive_kurta_set.png', 'Premium Festive Kurta Set', 0, true),
((SELECT id FROM products WHERE sku='DD-KKS-005'), '/images/products/kurtis-kurta-sets/kurti_5_modern_ethnic_kurti_set.png', 'Modern Ethnic Kurti Set', 0, true),

((SELECT id FROM products WHERE sku='DD-SAL-001'), '/images/products/salwar-suits/salwar_1_ivory_draped_cowl_cape.png', 'Ivory Draped Cowl Cape Salwar Suit', 0, true),
((SELECT id FROM products WHERE sku='DD-SAL-002'), '/images/products/salwar-suits/salwar_2_champagne_embroidered_cape.png', 'Champagne Embroidered Cape Salwar Suit', 0, true),
((SELECT id FROM products WHERE sku='DD-SAL-003'), '/images/products/salwar-suits/salwar_3_mocha_taupe_ruffled_dhoti.png', 'Mocha Taupe Ruffled Dhoti Cape Salwar Suit', 0, true),
((SELECT id FROM products WHERE sku='DD-SAL-004'), '/images/products/salwar-suits/salwar_4_dusty_rose_embroidered_cape.png', 'Dusty Rose Embroidered Cape Palazzo Salwar Suit', 0, true),
((SELECT id FROM products WHERE sku='DD-SAL-005'), '/images/products/salwar-suits/salwar_5_rose_gold_shimmer_halter.png', 'Rose Gold Shimmer Halter Salwar Suit', 0, true);

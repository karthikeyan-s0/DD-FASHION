# DD FASHION — Premium South Indian Women's Fashion Store

A complete, production-minded, full-stack e-commerce boutique platform crafted for South Indian women's traditional outfits, everyday combed cotton clothing, nightwear, festive collections, and heritage jewellery.

---

## 1. Brand Identity & Design System

The visual design is inspired by high-end boutique aesthetics (such as the editorial design philosophy seen in **Anaya Silks**), delivering an intimate luxury boutique feel rather than a cluttered marketplace.

### Core Colour Palette
- **Deep Wine Burgundy**: `#651D32` (Primary CTAs, badges, brand accents)
- **Dark Burgundy**: `#3B1020` (Announcement bar, footer, luxury contrast)
- **Warm Ivory**: `#FFF9F1` (Storefront background, warm natural textile vibe)
- **Champagne Gold**: `#C6A15B` (Borders, metadata kickers, delicate highlights)
- **Soft Rose**: `#E8C9C7` (Badges, subheadings, subtle cards)
- **Muted Taupe**: `#A69A90` (Dividers, borders, subtle helper text)
- **Main Text**: `#282323` (High legibility charcoal black)
- **Secondary Text**: `#716963` (Refined descriptive body)

### Typography
- **Headings & Serif Accents**: *Playfair Display* & *Cormorant Garamond*
- **Interface & Body**: *Inter* & *Manrope*

---

## 2. Technology Architecture

### Frontend
- **Framework**: React 18 with Vite & TypeScript
- **Styling**: Tailwind CSS with custom luxury boutique utility tokens
- **Animations**: Framer Motion & CSS smooth transforms
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State & Context**: Modular AuthContext, CartContext (with live slide-over bag), and WishlistContext
- **WhatsApp Integration**: Native deep linking with `https://wa.me/919894251098`

### Backend
- **Framework**: Python 3.10+ / FastAPI
- **Database**: SQLite (local development) with clean SQLAlchemy 2.0 ORM architecture (1-to-1 portable to PostgreSQL)
- **Security**: JWT authentication (HS256) with bcrypt-hashed passwords
- **API Architecture**: RESTful endpoints with Pydantic v2 schemas and Swagger documentation (`/docs`)
- **Seeding**: 24 distinct South Indian categories and 42 curated realistic products with authentic photography

---

## 3. Official WhatsApp Direct Ordering

- **Official Store WhatsApp Number**: `+91 98942 51098` (`919894251098`)
- **Product Page Quick Order**: "Order on WhatsApp" button pre-fills the garment title, SKU, price, chosen size, color, quantity, and product URL.
- **Cart Page Quick Order**: "Order Cart on WhatsApp" button formats the complete list of cart items, sizes, quantities, and subtotal.
- **Floating WhatsApp Widget**: Persistent bottom-right chat button with accessibility labels and tooltip.

---

## 4. Default Seed Accounts

The local database comes pre-seeded with:

### Administrator Account
- **Email**: `admin@ddfashion.com`
- **Password**: `Admin@DDFashion2026`
- **Access**: Full Admin Portal (`/admin`) for analytics, product CRUD, image upload, and order status updates.

### Customer Account
- **Email**: `customer@ddfashion.com`
- **Password**: `Customer@2026`
- **Access**: Saved addresses in Chennai, order history, and wishlist.

*(Note: The login page includes one-click autofill buttons for both demo accounts for effortless testing).*

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js (v18+) and npm
- Python (v3.10+)

### Backend Setup
1. Open a terminal in `dd-fashion/backend`:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
4. Initialize and seed the database:
   ```bash
   python -m app.seed
   ```
5. Run the backend development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   API Documentation is available at: `http://localhost:8000/docs`

### Frontend Setup
1. Open another terminal in `dd-fashion/frontend`:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the store at: `http://localhost:5173`

---

## 6. Running Automated Tests

Run the backend test suite:
```bash
cd backend
python -m pytest -v tests/test_api.py
```
This tests health checks, category discovery, product filtering/search, authentication, cart/order transactional stock deductions, and admin security.

---

## 7. Pending Credentials & Production Deployment

- **Razorpay Online Payments**: Configured in test-mode. To activate live UPI and card payments, provide `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`.
- **Database Migration**: To switch from SQLite to PostgreSQL in production, update `DATABASE_URL` in `.env` (e.g. `postgresql://user:password@host:5432/dd_fashion`).

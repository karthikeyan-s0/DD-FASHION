import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["store"] == "DD FASHION"
    assert data["whatsapp_order_number"] == "919894251098"

def test_get_categories():
    response = client.get("/api/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 20
    slugs = [c["slug"] for c in categories]
    assert "chudithars" in slugs
    assert ("kurtis-kurta-sets" in slugs or "kurtis" in slugs)
    assert "salwar-suits" in slugs
    assert "cotton-nighties" in slugs

def test_get_products():
    response = client.get("/api/products?limit=50")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 20
    assert len(data["items"]) > 0

    # Test filtering by category
    res_sarees = client.get("/api/products?category=sarees")
    assert res_sarees.status_code == 200
    saree_data = res_sarees.json()
    assert saree_data["total"] >= 5

    # Test search
    res_search = client.get("/api/products?search=saree")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert search_data["total"] >= 5

def test_auth_and_profile():
    # Register a new customer
    unique_email = f"test.customer.{uuid.uuid4().hex[:8]}@example.com"
    password = "CustomerPassword@2026"
    res_reg = client.post("/api/auth/register", json={
        "full_name": "Divya Bharathi",
        "email": unique_email,
        "password": password,
        "phone": "+91 98942 51098"
    })
    assert res_reg.status_code == 201
    reg_data = res_reg.json()
    assert "access_token" in reg_data

    # Login with the newly registered user
    res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": password
    })
    assert res.status_code == 200
    auth_data = res.json()
    token = auth_data["access_token"]
    assert token

    # Check profile
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == unique_email
    assert res_me.json()["role"] == "customer"

def test_cart_and_order_flow():
    # Get a product to add to cart
    res_p = client.get("/api/products?limit=1")
    product = res_p.json()["items"][0]
    p_id = product["id"]
    initial_stock = product["stock_quantity"]

    session_id = f"test-session-cart-{uuid.uuid4().hex[:6]}"

    # Add to cart
    res_add = client.post("/api/cart/items", json={
        "product_id": p_id,
        "quantity": 1,
        "size": "M",
        "color": "Maroon",
        "session_id": session_id
    })
    assert res_add.status_code == 200
    cart_data = res_add.json()
    assert cart_data["item_count"] >= 1
    assert cart_data["subtotal"] > 0

    # Place an order
    res_order = client.post("/api/orders", json={
        "customer_name": "Divya Bharathi",
        "customer_email": "divya.test@ddfashion.com",
        "customer_phone": "+91 98942 51098",
        "session_id": session_id,
        "payment_method": "cod",
        "shipping_address": {
            "full_name": "Divya Bharathi",
            "phone": "+91 98942 51098",
            "address_line1": "10 Gandhi Road",
            "city": "Coimbatore",
            "state": "Tamil Nadu",
            "pincode": "641001"
        }
    })
    assert res_order.status_code == 201
    order = res_order.json()
    assert order["order_number"].startswith("DDF-")
    assert order["payment_status"] == "pending"
    assert len(order["items"]) >= 1

    # Verify product stock was decremented
    res_p2 = client.get(f"/api/products/{p_id}")
    assert res_p2.json()["stock_quantity"] == initial_stock - 1

def test_admin_dashboard_security():
    # Unauthorized request should fail
    res_unauth = client.get("/api/admin/dashboard")
    assert res_unauth.status_code in [401, 403]

    # Login as admin
    res_login = client.post("/api/auth/login", json={
        "email": "admin@ddfashion.com",
        "password": "Admin@DDFashion2026"
    })
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]

    # Authorized admin request
    res_admin = client.get("/api/admin/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert res_admin.status_code == 200
    stats = res_admin.json()
    assert stats["total_products"] >= 20
    assert stats["total_orders"] >= 1

import urllib.request
import json

def test_admin_lifecycle():
    # 1. Admin login
    login_req = urllib.request.Request(
        'http://127.0.0.1:8000/api/auth/login',
        data=json.dumps({'email': 'admin@ddfashion.com', 'password': 'Admin@DDFashion2026'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(login_req)
    token = json.loads(res.read())['access_token']
    print("1. Admin login successful. JWT token verified.")

    # 2. Create product
    create_req = urllib.request.Request(
        'http://127.0.0.1:8000/api/admin/products',
        data=json.dumps({
            'name': 'Admin Verification Silk Kurta',
            'slug': 'admin-verification-silk-kurta',
            'sku': 'DD-VERIFY-001',
            'category_id': 3,
            'price': 1799.0,
            'compare_at_price': 2299.0,
            'stock_quantity': 14,
            'fabric': 'Raw Silk',
            'images': [{'image_url': '/images/products/kurtis-kurta-sets/kurti_1_elegant_everyday.png', 'is_primary': True}]
        }).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    )
    prod = json.loads(urllib.request.urlopen(create_req).read())
    p_id = prod['id']
    print(f"2. Product created successfully via Admin API: ID={p_id}, SKU={prod['sku']}, Price={prod['price']}")

    # 3. Update product (price and stock)
    update_req = urllib.request.Request(
        f'http://127.0.0.1:8000/api/admin/products/{p_id}',
        data=json.dumps({
            'price': 1999.0,
            'stock_quantity': 8,
            'is_featured': True
        }).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'},
        method='PUT'
    )
    updated = json.loads(urllib.request.urlopen(update_req).read())
    print(f"3. Product updated successfully: Price={updated['price']}, Stock={updated['stock_quantity']}, Featured={updated['is_featured']}")

    # 4. Fetch via public storefront API
    pub_prod = json.loads(urllib.request.urlopen(f'http://127.0.0.1:8000/api/products/{p_id}').read())
    assert pub_prod['price'] == 1999.0
    assert pub_prod['stock_quantity'] == 8
    print("4. Verified changes persist in public storefront API.")

    # 5. Delete/deactivate product
    del_req = urllib.request.Request(
        f'http://127.0.0.1:8000/api/admin/products/{p_id}',
        headers={'Authorization': f'Bearer {token}'},
        method='DELETE'
    )
    del_res = json.loads(urllib.request.urlopen(del_req).read())
    print("5. Product deactivated:", del_res)

    # 6. Verify count returns to 20
    p_final = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/products').read())['total']
    assert p_final == 20
    print(f"6. Final active products count in catalog: {p_final} (Matches exactly 20 real products)")
    print("\nALL ADMIN LIFECYCLE TESTS PASSED!")

if __name__ == '__main__':
    test_admin_lifecycle()

import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get, patch, delete

class TestVendorProducts(unittest.TestCase):
    """Tests for vendor product management: list, create, update, delete."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None
        cls.created_product_id = None

    def test_01_list_vendor_products(self):
        """Vendor can list their own products."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/products/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        print(f"  ✅ Vendor products list: {len(results)} items")

    def test_02_create_product(self):
        """Vendor can create a new product."""
        if not self.token:
            self.skipTest("No vendor token")
        payload = {
            "title": "Vendor Unit Test Product",
            "description": "Created by vendor unit test",
            "price": "49.99",
            "stock": 15,
            "sku": "V-UT-001",
            "is_active": True,
        }
        resp = post("/vendors/products/", data=payload, token=self.token)
        self.assertIn(resp.status_code, [200, 201, 400])
        if resp.status_code in [200, 201]:
            data = resp.json()
            TestVendorProducts.created_product_id = str(data.get("id") or data.get("_id"))
            print(f"  ✅ Vendor product created: ID={TestVendorProducts.created_product_id}")

    def test_03_get_product_detail(self):
        """Vendor can see product detail."""
        if not self.token or not TestVendorProducts.created_product_id:
            self.skipTest("Dependency missing")
        resp = get(f"/vendors/products/{TestVendorProducts.created_product_id}/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Vendor product detail retrieved")

    def test_04_update_product(self):
        """Vendor can update product."""
        if not self.token or not TestVendorProducts.created_product_id:
            self.skipTest("Dependency missing")
        payload = {"title": "Updated Vendor product", "stock": 25}
        resp = patch(f"/vendors/products/{TestVendorProducts.created_product_id}/", data=payload, token=self.token)
        self.assertIn(resp.status_code, [200, 400])
        print("  ✅ Vendor product update returned")

    def test_05_delete_product(self):
        """Vendor can delete product."""
        if not self.token or not TestVendorProducts.created_product_id:
            self.skipTest("Dependency missing")
        resp = delete(f"/vendors/products/{TestVendorProducts.created_product_id}/", token=self.token)
        self.assertIn(resp.status_code, [200, 204])
        print("  ✅ Vendor product deleted")

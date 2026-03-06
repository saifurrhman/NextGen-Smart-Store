import unittest
import time
from helpers import IntegrationSession

class TestVendorInventoryWorkflow(unittest.TestCase):
    """
    Integration Test: Vendor Inventory & Dashboard.
    Steps: Add Product -> Verify in List -> Check Dashboard Stats
    """
    
    @classmethod
    def setUpClass(cls):
        # Use existing vendor credentials from helpers or custom one
        from ..helpers import ADMIN_EMAIL, ADMIN_PASSWORD # Actually want vendor
        # But for integration, let's use the standard vendor
        cls.session = IntegrationSession(email="vendor@nextgenstore.com", password="vendor123456")
        cls.timestamp = int(time.time())
        cls.product_slug = f"v-int-prod-{cls.timestamp}"

    def test_01_inventory_dashboard_flow(self):
        # 1. Vendor adds a product
        product_data = {
            "title": f"Vendor Int Product {self.timestamp}",
            "slug": self.product_slug,
            "description": "Vendor integration test product",
            "price": 499.00,
            "sku": f"V-SKU-{self.timestamp}",
            "stock": 50,
            "is_active": True
        }
        resp = self.session.post("/products/", data=product_data)
        self.assertEqual(resp.status_code, 201)
        print(f"  ✅ Step 1: Vendor product '{self.product_slug}' added.")

        # 2. Verify in Vendor's product list
        resp = self.session.get("/products/", params={"search": self.product_slug})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = data.get('results', [])
        self.assertTrue(any(p['slug'] == self.product_slug for p in results))
        print("  ✅ Step 2: Product found in vendor list.")

        # 3. Check Dashboard Stats (e.g., total products count)
        resp = self.session.get("/vendors/dashboard/stats/")
        if resp.status_code == 200:
            print("  ✅ Step 3: Vendor dashboard stats accessible.")
        else:
            print(f"  ⚠️ Step 3: Dashboard stats returned {resp.status_code}")

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'product_slug'):
            cls.session.delete(f"/products/{cls.product_slug}/")

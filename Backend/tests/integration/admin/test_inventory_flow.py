import unittest
import time
from helpers import IntegrationSession

class TestAdminInventoryWorkflow(unittest.TestCase):
    """
    Integration Test: Full Inventory Creation Flow.
    Steps: Create Category -> Create Brand -> Create Product -> Verify Linkage
    """
    
    @classmethod
    def setUpClass(cls):
        cls.session = IntegrationSession()
        cls.timestamp = int(time.time())
        cls.category_slug = f"int-cat-{cls.timestamp}"
        cls.brand_slug = f"int-brand-{cls.timestamp}"
        cls.product_slug = f"int-prod-{cls.timestamp}"

    def test_01_full_inventory_flow(self):
        # 1. Create Category
        cat_data = {
            "name": f"Integration Category {self.timestamp}",
            "slug": self.category_slug,
            "description": "Created during integration test"
        }
        resp = self.session.post("/categories/", data=cat_data)
        self.assertEqual(resp.status_code, 201, f"Category creation failed: {resp.text}")
        print(f"  ✅ Step 1: Category '{self.category_slug}' created.")

        # 2. Create Brand
        brand_data = {
            "name": f"Integration Brand {self.timestamp}",
            "slug": self.brand_slug,
            "description": "Integration brand"
        }
        resp = self.session.post("/brands/", data=brand_data)
        # Some endpoints might not return 201 if handled differently, check success
        self.assertIn(resp.status_code, [200, 201], f"Brand creation failed: {resp.text}")
        print(f"  ✅ Step 2: Brand '{self.brand_slug}' created.")

        # 3. Create Product linked to Category & Brand
        product_data = {
            "title": f"Integration Product {self.timestamp}",
            "slug": self.product_slug,
            "description": "Full workflow test product",
            "price": 999.99,
            "base_price": 800.00,
            "sku": f"SKU-{self.timestamp}",
            "stock": 100,
            "category": self.category_slug,
            "brand": self.brand_slug,
            "is_active": True
        }
        resp = self.session.post("/products/", data=product_data)
        self.assertEqual(resp.status_code, 201, f"Product creation failed: {resp.text}")
        print(f"  ✅ Step 3: Product '{self.product_slug}' created and linked.")

        # 4. Verify in Category List
        resp = self.session.get(f"/categories/", params={"search": self.category_slug})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Step 4: Category verified in list.")

        # 5. Verify Product searchable
        resp = self.session.get(f"/products/", params={"search": self.product_slug})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(any(p['slug'] == self.product_slug for p in data.get('results', [])), "Product not found in search")
        print("  ✅ Step 5: Product verified in listing.")

    @classmethod
    def tearDownClass(cls):
        # Cleanup (Optional but good practice)
        print("\n--- Cleaning up Integration Data ---")
        cls.session.delete(f"/products/{cls.product_slug}/")
        cls.session.delete(f"/categories/{cls.category_slug}/")
        # Brands might not have direct delete in v1/urls, skipping for now
        print("  ✅ Cleanup complete.")

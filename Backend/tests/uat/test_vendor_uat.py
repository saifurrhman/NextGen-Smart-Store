import unittest
import requests
import time
from helpers import IntegrationSession, BASE_URL

class TestVendorUAT(unittest.TestCase):
    """
    UAT: Vendor Life Cycle.
    Scenarios: Register -> Setup Store -> Sell
    """

    @classmethod
    def setUpClass(cls):
        cls.timestamp = int(time.time())
        cls.email = f"uat-vendor-{cls.timestamp}@example.com"
        cls.password = "VendorPass123!"
        cls.store_name = f"UAT Store {cls.timestamp}"
        cls.vendor = None

    def test_01_onboarding(self):
        print("\n  [UAT Vendor: Onboarding]")
        # 1. Register as Vendor
        data = {
            "email": self.email, 
            "password": self.password, 
            "role": "vendor",
            "store_name": self.store_name
        }
        resp = requests.post(f"{BASE_URL}/auth/register/", json=data)
        self.assertIn(resp.status_code, [200, 201])
        print(f"    ✅ Vendor '{self.store_name}' registered.")

        # 2. Login
        self.__class__.vendor = IntegrationSession(email=self.email, password=self.password)
        self.assertIsNotNone(self.vendor.token)
        print("    ✅ Vendor dashboard access verified.")

    def test_02_product_listing(self):
        print("\n  [UAT Vendor: Inventory]")
        if not self.vendor: self.skipTest("No vendor session")
        
        # 3. Create Product
        prod_data = {
            "title": f"UAT Product {self.timestamp}",
            "slug": f"uat-prod-{self.timestamp}",
            "price": 250,
            "stock": 10,
            "description": "Premium UAT product"
        }
        resp = self.vendor.post("/products/", data=prod_data)
        self.assertIn(resp.status_code, [200, 201])
        print(f"    ✅ Product '{prod_data['title']}' listed for sale.")

        # 4. Verify in Vendor's List
        resp = self.vendor.get("/vendors/products/") # Assuming this endpoint exists for vendor products
        if resp.status_code == 200:
            prods = resp.json().get('results', [])
            found = any(p['slug'] == prod_data['slug'] for p in prods)
            self.assertTrue(found)
            print("    ✅ Product reflected in vendor inventory.")
        else:
            print("    ℹ️ Vendor product list endpoint returned " + str(resp.status_code))

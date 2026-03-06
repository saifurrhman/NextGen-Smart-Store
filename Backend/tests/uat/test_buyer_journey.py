import unittest
import requests
import time
from helpers import IntegrationSession, BASE_URL

class TestBuyerJourneyUAT(unittest.TestCase):
    """
    UAT: The Core Buyer Experience.
    Scenarios: Join -> Find -> Buy -> Track
    """

    @classmethod
    def setUpClass(cls):
        cls.timestamp = int(time.time())
        cls.email = f"uat-buyer-{cls.timestamp}@example.com"
        cls.password = "BuyerPass123!"
        cls.buyer = None

    def test_01_onboarding_and_auth(self):
        print("\n  [UAT Scenario 1: Onboarding]")
        # 1. Register
        reg_data = {"email": self.email, "password": self.password, "first_name": "UAT", "last_name": "Buyer"}
        resp = requests.post(f"{BASE_URL}/auth/register/", json=reg_data)
        self.assertIn(resp.status_code, [200, 201])
        print("    ✅ New user registered successfully.")

        # 2. Login
        self.__class__.buyer = IntegrationSession(email=self.email, password=self.password)
        self.assertIsNotNone(self.buyer.token)
        print("    ✅ Buyer logged in and session established.")

    def test_02_discovery_and_cart(self):
        print("\n  [UAT Scenario 2: Shopping]")
        if not self.buyer: self.skipTest("No buyer session")
        
        # 3. Browse Products
        resp = self.buyer.get("/products/")
        products = resp.json().get('results', [])
        self.assertTrue(len(products) > 0, "No products found for UAT!")
        product = products[0]
        print(f"    ✅ Browse successful. Found '{product['title']}'.")

        # 4. Add to Cart
        cart_data = {"product_slug": product['slug'], "quantity": 1}
        resp = self.buyer.post("/cart/", data=cart_data)
        self.assertIn(resp.status_code, [200, 201])
        print(f"    ✅ Product '{product['title']}' added to cart.")

    def test_03_checkout_and_confirmation(self):
        print("\n  [UAT Scenario 3: Purchase]")
        if not self.buyer: self.skipTest("No buyer session")
        
        # 5. Checkout
        checkout_data = {
            "shipping_address": "456 UAT Boulevard, Testing City",
            "payment_method": "COD"
        }
        resp = self.buyer.post("/orders/", data=checkout_data)
        self.assertIn(resp.status_code, [200, 201])
        order = resp.json()
        print(f"    ✅ Order placed successfully (Order ID: {order.get('id')}).")

        # 6. Verify My Orders
        resp = self.buyer.get("/orders/")
        orders = resp.json().get('results', [])
        # Find our order
        found = any(o['id'] == order['id'] for o in orders)
        self.assertTrue(found, "Order not found in Buyer's order history!")
        print("    ✅ Order confirmed in personal order history.")

    @classmethod
    def tearDownClass(cls):
        print("\n  [UAT Cleanup]")
        # Cleanup could involve deleting the test user and their orders
        # But in many UAT environments, we leave data for inspection
        pass

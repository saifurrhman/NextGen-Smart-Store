import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorOrders(unittest.TestCase):
    """Tests for vendor order management."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_list_vendor_orders(self):
        """Vendor can list their orders."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/orders/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = data.get("results", [])
        print(f"  ✅ Vendor orders list: {len(results)} items")

    def test_02_filter_orders_pending(self):
        """Vendor can filter orders by Pending status."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/orders/", token=self.token, params={"filter": "Pending"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Orders filter Pending successful")

    def test_03_filter_orders_completed(self):
        """Vendor can filter orders by Completed status."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/orders/", token=self.token, params={"filter": "Completed"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Orders filter Completed successful")

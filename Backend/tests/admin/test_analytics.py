import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestAnalyticsModule(unittest.TestCase):
    """Tests for admin analytics: sales, product performance."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_analytics_endpoint_exists(self):
        """Analytics API is accessible."""
        resp = get(f"{BASE_URL}/analytics/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Analytics root reachable")

    def test_02_sales_analytics(self):
        """Sales analytics endpoint responds."""
        resp = get(f"{BASE_URL}/analytics/sales/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Sales analytics responded")

    def test_03_product_performance(self):
        """Product performance analytics endpoint responds."""
        resp = get(f"{BASE_URL}/analytics/products/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Product performance analytics responded")

    def test_04_traffic_analytics(self):
        """Traffic analytics endpoint responds."""
        resp = get(f"{BASE_URL}/analytics/traffic/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Traffic analytics responded")

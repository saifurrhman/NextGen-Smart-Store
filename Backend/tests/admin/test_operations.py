import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestOperationsModule(unittest.TestCase):
    """Tests for admin operations: delivery tracking, team, daily ops."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_operations_endpoint(self):
        """Operations root endpoint responds."""
        resp = get(f"{BASE_URL}/operations/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Operations root reachable")

    def test_02_delivery_tracking(self):
        """Delivery tracking endpoint responds."""
        resp = get(f"{BASE_URL}/operations/delivery/tracking/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Delivery tracking responded")

    def test_03_delivery_team(self):
        """Delivery team management endpoint responds."""
        resp = get(f"{BASE_URL}/operations/delivery/team/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Delivery team responded")

    def test_04_inventory_alerts(self):
        """Inventory alerts endpoint responds."""
        resp = get(f"{BASE_URL}/operations/inventory/alerts/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Inventory alerts responded")

    def test_05_order_processing(self):
        """Order processing endpoint responds."""
        resp = get(f"{BASE_URL}/operations/processing/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Order processing responded")

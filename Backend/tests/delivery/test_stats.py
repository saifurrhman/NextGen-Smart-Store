import unittest
from helpers import BASE_URL, DELIVERY_EMAIL, DELIVERY_PASSWORD, post, get

class TestOperationsStats(unittest.TestCase):
    """Tests for daily stats and inventory alerts."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": DELIVERY_EMAIL, "password": DELIVERY_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_daily_stats_list(self):
        """Anyone (AllowAny) can see daily stats."""
        resp = get("/operations/daily-stats/")
        self.assertEqual(resp.status_code, 200)
        print(f"  ✅ Daily stats retrieved: {len(resp.json())} logs")

    def test_02_inventory_alerts(self):
        """Anyone can see inventory alerts."""
        resp = get("/operations/inventory-alerts/")
        self.assertEqual(resp.status_code, 200)
        print(f"  ✅ Inventory alerts retrieved: {len(resp.json())} products")

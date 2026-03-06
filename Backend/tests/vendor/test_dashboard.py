import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorDashboard(unittest.TestCase):
    """Tests for vendor dashboard stats and analytics."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_dashboard_requires_auth(self):
        """Dashboard endpoint should require authentication."""
        resp = get("/vendors/dashboard/")
        self.assertIn(resp.status_code, [401, 403])
        print("  ✅ Dashboard requires auth (returns 401/403)")

    def test_02_dashboard_stats_authenticated(self):
        """Authenticated vendor can see dashboard stats."""
        if not self.token:
            self.skipTest("No vendor token available")
        resp = get("/vendors/dashboard/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("stats", data)
        self.assertIn("topProducts", data)
        self.assertIn("recentOrders", data)
        self.assertIn("chart", data)
        print("  ✅ Dashboard stats returned successfully")

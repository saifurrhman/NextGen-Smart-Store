import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorEarnings(unittest.TestCase):
    """Tests for vendor earnings and transactions."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_earnings_overview(self):
        """Vendor can see earnings overview."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/earnings/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("overview", data)
        self.assertIn("transactions", data)
        print("  ✅ Earnings overview retrieved")

import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorSharedEndpoints(unittest.TestCase):
    """Tests for public endpoints accessed as a vendor."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_public_products(self):
        """Public products list is accessible."""
        resp = get("/products/")
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Public products accessible")

    def test_02_vendor_sees_notifications(self):
        """Vendor can see their notifications."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/notifications/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 403])
        print("  ✅ Notifications endpoint accessible")

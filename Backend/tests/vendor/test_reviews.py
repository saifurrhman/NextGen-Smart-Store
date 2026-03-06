import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorReviews(unittest.TestCase):
    """Tests for vendor product reviews and sentiment analytics."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_review_metrics(self):
        """Vendor can see review metrics and list."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/reviews/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("metrics", data)
        self.assertIn("reviews", data)
        print("  ✅ Review metrics retrieved")

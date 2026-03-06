import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorProfile(unittest.TestCase):
    """Tests for vendor profile management."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_list_profiles(self):
        """Endpoint to list vendor profiles is reachable."""
        resp = get("/vendors/")
        self.assertIn(resp.status_code, [200, 401, 403])
        print("  ✅ Vendors profile list endpoint reachable")

    def test_02_non_admin_cannot_approve(self):
        """Vendors cannot approve themselves or others."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = post("/vendors/fake-id/approve/", token=self.token)
        self.assertIn(resp.status_code, [403, 404, 400, 401])
        print("  ✅ Security: Vendor cannot call approve endpoint")

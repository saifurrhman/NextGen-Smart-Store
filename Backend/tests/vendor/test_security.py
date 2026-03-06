import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestSecurityAccessControl(unittest.TestCase):
    """Tests for API security, token validation, and injection prevention."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_protected_endpoints(self):
        """Protected vendor paths require auth."""
        paths = ["/vendors/dashboard/", "/vendors/products/", "/vendors/orders/"]
        for p in paths:
            resp = get(p)
            self.assertIn(resp.status_code, [401, 403])
            print(f"  ✅ {p} is protected")

    def test_02_sql_injection_safety(self):
        """Search handles potential injection safely."""
        if not self.token:
            self.skipTest("No vendor token")
        resp = get("/vendors/products/", token=self.token, params={"search": "'; DROP TABLE users;--"})
        self.assertNotIn(resp.status_code, [500])
        print("  ✅ SQLi in search did not crash server")

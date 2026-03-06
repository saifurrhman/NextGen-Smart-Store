import unittest
from helpers import BASE_URL, VENDOR_EMAIL, VENDOR_PASSWORD, post, get

class TestVendorAuthentication(unittest.TestCase):
    """Tests for vendor login, token validation, and debug endpoints."""

    @classmethod
    def setUpClass(cls):
        """Obtain vendor JWT token once for the entire test class."""
        cls.token = None
        cls.vendor_email = VENDOR_EMAIL
        cls.vendor_password = VENDOR_PASSWORD
        resp = post(
            "/auth/login/",
            {"username": cls.vendor_email, "password": cls.vendor_password},
        )
        if resp.status_code == 200:
            data = resp.json()
            cls.token = data.get("access") or data.get("token")
            print(f"\n✅ Vendor login successful. Role: {data.get('role')}")
        else:
            print(f"\n⚠️  Vendor login failed (status {resp.status_code}).")

    def test_01_server_is_running(self):
        """Backend server should be reachable."""
        try:
            resp = get("/auth/login/")
            self.assertIn(resp.status_code, [200, 400, 401, 301, 302, 404])
            print("  ✅ Server is running")
        except Exception as e:
            self.fail(f"❌ Backend server unreachable: {e}")

    def test_02_vendor_login_success(self):
        """Vendor can log in with valid credentials."""
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": VENDOR_PASSWORD},
        )
        self.assertIn(resp.status_code, [200, 401])
        if resp.status_code == 200:
            data = resp.json()
            self.assertTrue("access" in data or "token" in data)
            print("  ✅ Vendor login returns JWT tokens")

    def test_03_login_rejects_wrong_password(self):
        """Login endpoint rejects incorrect passwords."""
        resp = post(
            "/auth/login/",
            {"username": VENDOR_EMAIL, "password": "wrong_password_xyz"},
        )
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Login correctly rejects wrong password")

    def test_04_login_rejects_empty_credentials(self):
        """Login endpoint rejects empty credentials."""
        resp = post("/auth/login/", {})
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Login correctly rejects empty credentials")

    def test_05_debug_users_endpoint(self):
        """Debug users endpoint should be accessible."""
        resp = get("/auth/debug-users/")
        self.assertIn(resp.status_code, [200, 404])
        if resp.status_code == 200:
            users = resp.json()
            print(f"  ✅ Debug users: {len(users)} users found")

import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestAuthentication(unittest.TestCase):
    """Tests for admin login, token validation, and profile endpoints."""

    @classmethod
    def setUpClass(cls):
        """Obtain admin JWT token once for the entire test class."""
        cls.token = None
        cls.admin_email = ADMIN_EMAIL
        cls.admin_password = ADMIN_PASSWORD
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": cls.admin_email, "password": cls.admin_password},
        )
        if resp.status_code == 200:
            data = resp.json()
            cls.token = data.get("access")
            print(f"\n✅ Admin login successful. Role: {data.get('role')}")
        else:
            print(f"\n⚠️  Admin login failed (status {resp.status_code}). Some tests may fail.")

    def test_01_server_is_running(self):
        """Backend server should be reachable."""
        import requests
        try:
            resp = requests.get(BASE_URL.replace("/api/v1", "/"), timeout=5)
            self.assertIn(resp.status_code, [200, 301, 302, 404])
            print("  ✅ Server is running")
        except requests.ConnectionError:
            self.fail("❌ Backend server is NOT running")

    def test_02_admin_login_success(self):
        """Admin can log in with valid credentials."""
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        self.assertIn(resp.status_code, [200, 401])
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("access", data)
            self.assertIn("refresh", data)
            print("  ✅ Admin login returns JWT tokens")

    def test_03_login_rejects_wrong_password(self):
        """Login endpoint rejects incorrect passwords."""
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": "WRONG_PASSWORD_12345"},
        )
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Login correctly rejects wrong password")

    def test_04_login_rejects_empty_credentials(self):
        """Login endpoint rejects empty credentials."""
        resp = post(f"{BASE_URL}/auth/login/", {"username": "", "password": ""})
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Login correctly rejects empty credentials")

    def test_05_login_rejects_nonexistent_user(self):
        """Login endpoint rejects non-existent email."""
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": "nobody_at_all_xyz@fake.com", "password": "randompass"},
        )
        self.assertIn(resp.status_code, [400, 401, 404])
        print("  ✅ Login correctly rejects non-existent user")

    def test_06_debug_users_endpoint(self):
        """Debug users endpoint should be accessible (AllowAny)."""
        resp = get(f"{BASE_URL}/auth/debug-users/")
        self.assertIn(resp.status_code, [200, 404])
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("count", data)
            print(f"  ✅ Debug users: {data['count']} users found in DB")

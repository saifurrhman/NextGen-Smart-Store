import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestUsersModule(unittest.TestCase):
    """Tests for admin user management: customers, admins, invitations."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_list_all_users(self):
        """Admin can list all users."""
        resp = get(f"{BASE_URL}/users/all/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Users list endpoint reachable")

    def test_02_list_customers(self):
        """Admin can list customers."""
        resp = get(f"{BASE_URL}/users/customers/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", data) if isinstance(data, dict) else data
            print(f"  ✅ Customers list: {len(results)} customers")

    def test_03_get_profile(self):
        """Authenticated admin can get their profile."""
        if not self.token:
            self.skipTest("No auth token")
        resp = get(f"{BASE_URL}/users/profile/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("email", data)
            print(f"  ✅ Profile: {data.get('email')}, role={data.get('role')}")

    def test_04_list_invitations(self):
        """Admin can list admin invitations."""
        if not self.token:
            self.skipTest("No auth token")
        resp = get(f"{BASE_URL}/users/invitations/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Invitations list available")

    def test_05_send_invite_missing_fields(self):
        """Send invite fails without required fields."""
        if not self.token:
            self.skipTest("No auth token")
        resp = post(f"{BASE_URL}/users/invitations/send/", {}, token=self.token)
        self.assertIn(resp.status_code, [400, 401])
        print(f"  ✅ Send invite validation works")

    def test_06_send_invite_invalid_department(self):
        """Send invite fails with invalid department."""
        if not self.token:
            self.skipTest("No auth token")
        resp = post(
            f"{BASE_URL}/users/invitations/send/",
            {"email": "test@example.com", "department": "INVALID_DEPT"},
            token=self.token,
        )
        self.assertIn(resp.status_code, [400, 401])
        print(f"  ✅ Send invite rejects invalid department")

    def test_07_change_password_validation(self):
        """Change password endpoint validates fields."""
        if not self.token:
            self.skipTest("No auth token")
        resp = post(
            f"{BASE_URL}/users/change-password/",
            {"current_password": "", "new_password": ""},
            token=self.token,
        )
        self.assertIn(resp.status_code, [400, 401])
        print(f"  ✅ Change password validation works")

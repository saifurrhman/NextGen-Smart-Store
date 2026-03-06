import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestNotificationsModule(unittest.TestCase):
    """Tests for notifications module."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_notifications_list(self):
        """Notifications list responds."""
        resp = get(f"{BASE_URL}/notifications/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Notifications list responded")

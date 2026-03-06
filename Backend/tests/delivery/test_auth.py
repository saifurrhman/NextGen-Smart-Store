import unittest
from helpers import BASE_URL, DELIVERY_EMAIL, DELIVERY_PASSWORD, post, get

class TestDeliveryAuthentication(unittest.TestCase):
    """Tests for delivery personnel authentication."""

    @classmethod
    def setUpClass(cls):
        cls.token = None
        resp = post(
            "/auth/login/",
            {"username": DELIVERY_EMAIL, "password": DELIVERY_PASSWORD},
        )
        if resp.status_code == 200:
            cls.token = resp.json().get("access") or resp.json().get("token")
            print(f"\n✅ Delivery login successful. Role: {resp.json().get('role')}")

    def test_01_delivery_login_success(self):
        """Delivery user can log in."""
        resp = post(
            "/auth/login/",
            {"username": DELIVERY_EMAIL, "password": DELIVERY_PASSWORD},
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue("access" in data or "token" in data)
        print("  ✅ Delivery login returns tokens")

    def test_02_login_rejects_invalid(self):
        """Login rejects wrong password."""
        resp = post(
            "/auth/login/",
            {"username": DELIVERY_EMAIL, "password": "wrong_password_786"},
        )
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Login correctly rejects wrong password")

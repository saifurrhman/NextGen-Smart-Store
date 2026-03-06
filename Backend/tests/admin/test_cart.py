import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestCartModule(unittest.TestCase):
    """Tests for cart module endpoints (Admin visibility)."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_cart_endpoint(self):
        """Cart endpoint responds."""
        resp = get(f"{BASE_URL}/cart/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Cart endpoint responded")

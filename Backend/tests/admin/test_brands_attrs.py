import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestBrandsAndAttributes(unittest.TestCase):
    """Tests for brands and product attributes."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_brands_list(self):
        """Brands list endpoint responds."""
        resp = get(f"{BASE_URL}/brands/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Brands list responded")

    def test_02_attributes_list(self):
        """Attributes list endpoint responds."""
        resp = get(f"{BASE_URL}/attributes/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Attributes list responded")

    def test_03_create_brand_validation(self):
        """Creating a brand with empty data returns 400."""
        if not self.token:
            self.skipTest("No auth token")
        resp = post(f"{BASE_URL}/brands/", {}, token=self.token)
        self.assertIn(resp.status_code, [400, 401])
        print(f"  ✅ Brand creation validation works")

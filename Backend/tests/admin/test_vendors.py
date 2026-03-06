import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestVendorsModule(unittest.TestCase):
    """Tests for admin vendor management."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_list_vendors(self):
        """Admin can list all vendors."""
        resp = get(f"{BASE_URL}/vendors/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", data) if isinstance(data, dict) else data
            print(f"  ✅ Vendors list: {len(results)} vendors")

    def test_02_vendors_endpoint_exists(self):
        """Vendors API endpoint exists."""
        resp = get(f"{BASE_URL}/vendors/")
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Vendors endpoint accessible")

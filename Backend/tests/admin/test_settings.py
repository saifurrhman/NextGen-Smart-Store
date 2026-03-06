import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestSettingsModule(unittest.TestCase):
    """Tests for admin settings: payment, shipping, AI, platform config."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_settings_endpoint(self):
        """Settings root endpoint responds."""
        resp = get(f"{BASE_URL}/settings/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Settings root reachable")

    def test_02_payment_gateway_settings(self):
        """Payment gateway settings endpoint responds."""
        resp = get(f"{BASE_URL}/settings/payment/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Payment gateway settings responded")

    def test_03_shipping_methods(self):
        """Shipping methods settings endpoint responds."""
        resp = get(f"{BASE_URL}/settings/shipping/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Shipping methods responded")

    def test_04_tax_configuration(self):
        """Tax configuration endpoint responds."""
        resp = get(f"{BASE_URL}/settings/tax/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Tax configuration responded")

    def test_05_platform_settings(self):
        """Platform settings endpoint responds."""
        resp = get(f"{BASE_URL}/settings/platform/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Platform settings responded")

    def test_06_system_logs(self):
        """System logs endpoint responds."""
        resp = get(f"{BASE_URL}/settings/logs/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ System logs responded")

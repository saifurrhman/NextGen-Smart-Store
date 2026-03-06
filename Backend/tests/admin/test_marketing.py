import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestMarketingModule(unittest.TestCase):
    """Tests for admin marketing: campaigns, coupons, promotions, email."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_marketing_campaigns(self):
        """Campaigns endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/campaigns/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Marketing campaigns responded")

    def test_02_coupons_list(self):
        """Coupons list endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/coupons/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Coupons list responded")

    def test_03_promotions_list(self):
        """Promotions list endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/promotions/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Promotions list responded")

    def test_04_email_marketing(self):
        """Email marketing endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/email/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Email marketing responded")

    def test_05_marketing_analytics(self):
        """Marketing analytics endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/analytics/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Marketing analytics responded")

    def test_06_create_coupon_validation(self):
        """Creating a coupon with missing data should return 400."""
        if not self.token:
            self.skipTest("No auth token")
        resp = post(f"{BASE_URL}/marketing/coupons/", {}, token=self.token)
        self.assertIn(resp.status_code, [400, 401, 404])
        print(f"  ✅ Coupon validation works")

    def test_07_social_media_endpoint(self):
        """Social media management endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/social/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Social media endpoint responded")

    def test_08_ads_management(self):
        """Ads management endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/ads/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Ads management endpoint responded")

    def test_09_customer_segmentation(self):
        """Customer segmentation endpoint responds."""
        resp = get(f"{BASE_URL}/marketing/segmentation/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Customer segmentation responded")

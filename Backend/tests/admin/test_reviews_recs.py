import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestReviewsAndRecommendations(unittest.TestCase):
    """Tests for reviews and recommendations."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_reviews_list(self):
        """Reviews list endpoint responds."""
        resp = get(f"{BASE_URL}/reviews/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Reviews list responded")

    def test_02_recommendations_list(self):
        """Recommendations list endpoint responds."""
        resp = get(f"{BASE_URL}/recommendations/", token=self.token)
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Recommendations list responded")

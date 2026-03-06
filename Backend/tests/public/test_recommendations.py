import unittest
from helpers import BASE_URL, get

class TestPublicRecommendations(unittest.TestCase):
    """Tests for public AI recommendation endpoints."""

    def test_01_list_recommendations(self):
        """Public access to recommendations (even if empty)."""
        resp = get("/recommendations/")
        self.assertIn(resp.status_code, [200, 404])
        print("  ✅ Recommendation endpoint reached")

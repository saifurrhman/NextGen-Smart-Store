import unittest
from helpers import BASE_URL, get

class TestPublicReviews(unittest.TestCase):
    """Tests for public review views."""

    def test_01_list_all_reviews(self):
        """Anyone can see reviews."""
        resp = get("/reviews/")
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Public reviews list accessible")

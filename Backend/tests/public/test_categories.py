import unittest
from helpers import BASE_URL, get

class TestPublicCategories(unittest.TestCase):
    """Tests for public category browsing endpoints."""

    def test_01_list_categories(self):
        """Anyone can list categories."""
        resp = get("/categories/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("results", data)
        print(f"  ✅ Public categories list: {len(data['results'])} items found")

    def test_02_category_search(self):
        """Anyone can search categories."""
        resp = get("/categories/", params={"search": "fashion"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Public category search successful")

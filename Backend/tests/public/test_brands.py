import unittest
from helpers import BASE_URL, get

class TestPublicBrands(unittest.TestCase):
    """Tests for public brand browsing endpoints."""

    def test_01_list_brands(self):
        """Anyone can list brands."""
        resp = get("/brands/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        print(f"  ✅ Public brands list: {len(results)} items found")

    def test_02_brand_search(self):
        """Anyone can search brands."""
        resp = get("/brands/", params={"search": "next"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Public brand search successful")

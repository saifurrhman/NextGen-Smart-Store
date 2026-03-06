import unittest
from helpers import BASE_URL, get

class TestPublicProducts(unittest.TestCase):
    """Tests for public product browsing endpoints."""

    def test_01_list_products(self):
        """Anyone can list products."""
        resp = get("/products/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("results", data)
        print(f"  ✅ Public products list: {len(data['results'])} items found")

    def test_02_search_products(self):
        """Anyone can search products."""
        resp = get("/products/", params={"search": "test"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Public product search successful")

    def test_03_product_detail_not_found(self):
        """404 for non-existent product."""
        resp = get("/products/non_existent_slug_or_id/")
        self.assertEqual(resp.status_code, 404)
        print("  ✅ Product detail 404 handled")

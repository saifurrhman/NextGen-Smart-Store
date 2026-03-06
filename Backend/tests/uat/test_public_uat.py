import unittest
import requests
from helpers import BASE_URL

class TestPublicUAT(unittest.TestCase):
    """
    UAT: Public Guest Experience.
    Scenarios: Home -> Search -> Discover
    """

    def test_01_homepage_and_catalogue(self):
        print("\n  [UAT Public: Browsing]")
        # 1. Homepage Products
        resp = requests.get(f"{BASE_URL}/products/", timeout=10)
        self.assertEqual(resp.status_code, 200)
        data = resp.json().get('results', [])
        self.assertTrue(len(data) > 0, "Guest sees empty homepage!")
        print(f"    ✅ Homepage loaded with {len(data)} products.")

    def test_02_search_functionality(self):
        print("\n  [UAT Public: Search]")
        # 2. Search for common term
        term = "test"
        resp = requests.get(f"{BASE_URL}/products/", params={"search": term}, timeout=10)
        self.assertEqual(resp.status_code, 200)
        print(f"    ✅ Search for '{term}' successful.")

    def test_03_category_browsing(self):
        print("\n  [UAT Public: Categories]")
        # 3. List Categories
        resp = requests.get(f"{BASE_URL}/categories/", timeout=10)
        self.assertEqual(resp.status_code, 200)
        cats = resp.json().get('results', [])
        self.assertTrue(len(cats) > 0, "Guest sees no categories!")
        print(f"    ✅ Category navigation is functional.")

    def test_04_product_details(self):
        print("\n  [UAT Public: Details]")
        # 4. View specific product
        resp = requests.get(f"{BASE_URL}/products/", timeout=10)
        product = resp.json()['results'][0]
        slug = product['slug']
        
        resp = requests.get(f"{BASE_URL}/products/{slug}/", timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()['slug'], slug)
        print(f"    ✅ Product details for '{product['title']}' loaded correctly.")

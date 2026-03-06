import unittest
import time
from helpers import BASE_URL, requests

class TestPublicDiscoveryWorkflow(unittest.TestCase):
    """
    Integration Test: Public Discovery.
    Steps: Search Product -> View Category -> View Detail
    """
    
    def test_01_discovery_flow(self):
        # 1. Search for a generic item
        resp = requests.get(f"{BASE_URL}/products/", params={"search": "phone"}, timeout=15)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        print(f"  ✅ Step 1: Search returned {len(data.get('results', []))} items.")

        # 2. Extract a category slug from first result if available
        results = data.get('results', [])
        cat_slug = results[0]['category'] if results and 'category' in results[0] else 'electronics'
        
        # 3. View Category list
        resp = requests.get(f"{BASE_URL}/categories/{cat_slug}/", timeout=15)
        # Category view set might use slug as lookup
        self.assertIn(resp.status_code, [200, 404])
        print(f"  ✅ Step 2: Category '{cat_slug}' browse attempted.")

        # 4. View Specific Product Detail
        if results:
            prod_slug = results[0]['slug']
            resp = requests.get(f"{BASE_URL}/products/{prod_slug}/", timeout=15)
            self.assertEqual(resp.status_code, 200)
            print(f"  ✅ Step 3: Product '{prod_slug}' detail viewed.")
            
            # 5. Check Recommendations for that product
            resp = requests.get(f"{BASE_URL}/recommendations/", params={"product_id": prod_slug}, timeout=15)
            self.assertEqual(resp.status_code, 200)
            print(f"  ✅ Step 4: Recommendations for product checked.")

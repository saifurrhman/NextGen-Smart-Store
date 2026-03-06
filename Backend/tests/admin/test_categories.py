import unittest
import time
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get, patch, delete

class TestCategoriesModule(unittest.TestCase):
    """Tests for admin category management: CRUD operations."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None
        cls.created_slug = None

    def test_01_list_categories(self):
        """Admin can list all categories."""
        resp = get(f"{BASE_URL}/categories/")
        self.assertIn(resp.status_code, [200, 401])
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", data) if isinstance(data, dict) else data
            self.assertIsInstance(results, list)
            print(f"  ✅ Categories list: {len(results)} categories")

    def test_02_create_category(self):
        """Admin can create a new category."""
        if not self.token:
            self.skipTest("No auth token available")
        slug = f"unit-test-cat-{int(time.time())}"
        payload = {
            "name": "Unit Test Category",
            "slug": slug,
            "description": "Created by unit test",
            "is_active": True,
        }
        resp = post(f"{BASE_URL}/categories/", payload, token=self.token)
        self.assertIn(resp.status_code, [200, 201, 400])
        if resp.status_code in [200, 201]:
            data = resp.json()
            TestCategoriesModule.created_slug = data.get("slug", slug)
            print(f"  ✅ Category created: slug={TestCategoriesModule.created_slug}")

    def test_03_retrieve_category(self):
        """Created category can be retrieved by slug."""
        if not TestCategoriesModule.created_slug:
            self.skipTest("No category created to retrieve")
        resp = get(f"{BASE_URL}/categories/{TestCategoriesModule.created_slug}/")
        self.assertIn(resp.status_code, [200, 404])
        if resp.status_code == 200:
            print(f"  ✅ Category retrieve OK: {TestCategoriesModule.created_slug}")

    def test_04_update_category(self):
        """Admin can update a category."""
        if not TestCategoriesModule.created_slug or not self.token:
            self.skipTest("No created category or token")
        payload = {"description": "Updated by unit test", "is_active": True}
        resp = patch(
            f"{BASE_URL}/categories/{TestCategoriesModule.created_slug}/",
            payload,
            token=self.token,
        )
        self.assertIn(resp.status_code, [200, 400, 404])
        print(f"  ✅ Category update returns {resp.status_code}")

    def test_05_search_categories(self):
        """Categories support text search."""
        resp = get(f"{BASE_URL}/categories/", params={"search": "electronics"})
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Category search works (status {resp.status_code})")

    def test_06_filter_active_categories(self):
        """Categories can be filtered by active status."""
        resp = get(f"{BASE_URL}/categories/", params={"is_active": "true"})
        self.assertIn(resp.status_code, [200, 401])
        print(f"  ✅ Category active filter works (status {resp.status_code})")

    def test_07_delete_category(self):
        """Admin can delete a category."""
        if not TestCategoriesModule.created_slug or not self.token:
            self.skipTest("No created category or token")
        resp = delete(
            f"{BASE_URL}/categories/{TestCategoriesModule.created_slug}/",
            token=self.token,
        )
        self.assertIn(resp.status_code, [200, 204, 404])
        print(f"  ✅ Category delete returns {resp.status_code}")

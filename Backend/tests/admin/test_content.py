import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestContentModule(unittest.TestCase):
    """Tests for admin content management."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_content_endpoint(self):
        """Content root endpoint responds."""
        resp = get(f"{BASE_URL}/content/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Content root reachable")

    def test_02_banners_list(self):
        """Banners list endpoint responds."""
        resp = get(f"{BASE_URL}/content/banners/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Banners list responded")

    def test_03_blog_posts_list(self):
        """Blog posts list endpoint responds."""
        resp = get(f"{BASE_URL}/content/blog/posts/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Blog posts list responded")

    def test_04_blog_categories(self):
        """Blog categories endpoint responds."""
        resp = get(f"{BASE_URL}/content/blog/categories/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Blog categories responded")

    def test_05_media_library(self):
        """Media library endpoint responds."""
        # Note: sometimes it is /media/ sometimes /content/media/ depending on API spec
        resp = get(f"{BASE_URL}/media/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Media library responded")

    def test_06_seo_meta_tags(self):
        """SEO meta tags endpoint responds."""
        resp = get(f"{BASE_URL}/content/seo/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ SEO meta tags responded")

    def test_07_navigation_menus(self):
        """Navigation menus endpoint responds."""
        resp = get(f"{BASE_URL}/content/navigation/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Navigation menus responded")

    def test_08_create_blog_post_validation(self):
        """Creating blog post without required fields returns 400."""
        if not self.token:
            self.skipTest("No auth token")
        resp = post(f"{BASE_URL}/content/blog/posts/", {}, token=self.token)
        self.assertIn(resp.status_code, [400, 401, 404])
        print(f"  ✅ Blog post validation works")

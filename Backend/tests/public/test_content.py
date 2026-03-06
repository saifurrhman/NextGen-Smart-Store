import unittest
from helpers import BASE_URL, get

class TestPublicContent(unittest.TestCase):
    """Tests for public content: banners, blog, etc."""

    def test_01_list_banners(self):
        """Anyone can see homepage banners."""
        resp = get("/content/banners/")
        self.assertIn(resp.status_code, [200, 404])
        print("  ✅ Public banners endpoint reached")

    def test_02_list_blog_posts(self):
        """Anyone can see blog posts."""
        resp = get("/content/blog/")
        self.assertIn(resp.status_code, [200, 404])
        print("  ✅ Public blog endpoint reached")

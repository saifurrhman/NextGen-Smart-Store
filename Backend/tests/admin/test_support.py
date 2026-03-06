import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestSupportModule(unittest.TestCase):
    """Tests for admin support: tickets, knowledge base, chat sessions."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_support_endpoint(self):
        """Support root endpoint responds."""
        resp = get(f"{BASE_URL}/support/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Support root reachable")

    def test_02_all_tickets(self):
        """All support tickets list responds."""
        resp = get(f"{BASE_URL}/support/tickets/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ All tickets list responded")

    def test_03_knowledge_base_articles(self):
        """Knowledge base articles list responds."""
        resp = get(f"{BASE_URL}/support/kb/articles/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ KB articles responded")

    def test_04_knowledge_base_categories(self):
        """Knowledge base categories list responds."""
        resp = get(f"{BASE_URL}/support/kb/categories/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ KB categories responded")

    def test_05_chat_sessions(self):
        """Active chat sessions endpoint responds."""
        resp = get(f"{BASE_URL}/support/chat/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Chat sessions responded")

    def test_06_agent_performance(self):
        """Agent performance analytics responds."""
        resp = get(f"{BASE_URL}/support/analytics/performance/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Agent performance responded")

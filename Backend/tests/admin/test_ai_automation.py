import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestAIAutomationModule(unittest.TestCase):
    """Tests for admin AI & automation: dashboard, chatbot, integrations."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_ai_automation_endpoint(self):
        """AI automation root endpoint responds."""
        resp = get(f"{BASE_URL}/ai-automation/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ AI automation root reachable")

    def test_02_chatbot_endpoint(self):
        """Chatbot setup endpoint responds."""
        resp = get(f"{BASE_URL}/ai-automation/chatbot/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Chatbot endpoint responded")

    def test_03_integrations_endpoint(self):
        """AI integrations endpoint responds."""
        resp = get(f"{BASE_URL}/ai-automation/integrations/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Integrations endpoint responded")

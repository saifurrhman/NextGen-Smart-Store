import unittest
from helpers import BASE_URL, DELIVERY_EMAIL, DELIVERY_PASSWORD, post, get

class TestDeliveryTasks(unittest.TestCase):
    """Tests for delivery tasks and assignments."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": DELIVERY_EMAIL, "password": DELIVERY_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_list_my_tasks(self):
        """Delivery boy can see their tasks."""
        if not self.token:
            self.skipTest("No delivery token")
        resp = get("/operations/delivery/my-tasks/", token=self.token)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        print(f"  ✅ My Tasks list: {len(data)} items found")

    def test_02_task_history(self):
        """Delivery boy can see task history."""
        if not self.token:
            self.skipTest("No delivery token")
        resp = get("/operations/delivery/my-tasks/", token=self.token, params={"include_history": "true"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Task history retrieved")

    def test_03_list_all_deliveries(self):
        """Delivery boy can see general delivery list (AllowAny in view)."""
        resp = get("/operations/delivery/")
        self.assertEqual(resp.status_code, 200)
        print("  ✅ General delivery list accessible")

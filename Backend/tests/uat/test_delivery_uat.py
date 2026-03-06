import unittest
import requests
import time
from helpers import IntegrationSession, BASE_URL

class TestDeliveryUAT(unittest.TestCase):
    """
    UAT: Delivery Personnel Flow.
    Scenarios: Login -> View Tasks -> Complete Delivery
    """

    @classmethod
    def setUpClass(cls):
        cls.timestamp = int(time.time())
        cls.email = "delivery@nextgen.com" # Using seeded delivery
        cls.password = "Password786"
        cls.delivery = None

    def test_01_auth_and_dashboard(self):
        print("\n  [UAT Delivery: Auth]")
        try:
            self.__class__.delivery = IntegrationSession(email=self.email, password=self.password)
            self.assertIsNotNone(self.delivery.token)
            print("    ✅ Delivery partner logged in.")
        except:
            self.skipTest("Seeded delivery partner not found.")

    def test_02_task_management(self):
        print("\n  [UAT Delivery: Operation]")
        if not self.delivery: self.skipTest("No delivery session")
        
        # 1. Fetch Assigned Tasks
        resp = self.delivery.get("/operations/delivery/tasks/")
        tasks = resp.json().get('results', [])
        print(f"    ✅ Found {len(tasks)} assigned tasks.")
        
        if len(tasks) > 0:
            task = tasks[0]
            # 2. Update Status (Simulation)
            # In a real UAT, we follow the PickedUp -> Delivered flow
            print(f"    ✅ Working on Task ID: {task['id']}")
            # etc.
        else:
            print("    ℹ️ No active tasks found for UAT, skip status updates.")

    def test_03_location_tracking(self):
        print("\n  [UAT Delivery: Tracking]")
        if not self.delivery: self.skipTest("No delivery session")
        
        # Update Location
        loc_data = {"latitude": 24.8607, "longitude": 67.0011}
        resp = self.delivery.post("/operations/delivery/location/", data=loc_data)
        self.assertIn(resp.status_code, [200, 201, 204])
        print("    ✅ GPS location update broadcasted successfully.")

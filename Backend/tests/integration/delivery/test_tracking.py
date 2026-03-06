import unittest
from helpers import IntegrationSession

class TestDeliveryTrackingWorkflow(unittest.TestCase):
    """
    Integration Test: Delivery Tracking.
    Steps: Update Location -> Verify Record
    """
    
    @classmethod
    def setUpClass(cls):
        cls.session = IntegrationSession(email="delivery@nextgen.com", password="Password786")

    def test_01_location_update_flow(self):
        # 1. Get a delivery ID
        resp = self.session.get("/operations/delivery/my-tasks/")
        tasks = resp.json()
        if not tasks:
            self.skipTest("No active tasks to test tracking")
        
        delivery_id = tasks[0]['id']

        # 2. Update location
        loc_data = {
            "latitude": 31.5204,
            "longitude": 74.3587
        }
        resp = self.session.post(f"/operations/delivery/{delivery_id}/update-location/", data=loc_data)
        self.assertEqual(resp.status_code, 200)
        print(f"  ✅ Step 1: Location updated for delivery {delivery_id}.")

        # 3. Verify location in delivery details
        resp = self.session.get(f"/operations/delivery/{delivery_id}/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(float(data['latitude']), 31.5204)
        self.assertEqual(float(data['longitude']), 74.3587)
        print("  ✅ Step 2: Saved location verified in delivery details.")

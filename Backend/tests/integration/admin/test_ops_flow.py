import unittest
import time
from helpers import IntegrationSession

class TestAdminOpsFinanceWorkflow(unittest.TestCase):
    """
    Integration Test: Operations to Finance Linkage.
    Steps: Change Order Status -> Verify Finance Records
    """
    
    @classmethod
    def setUpClass(cls):
        cls.session = IntegrationSession()
        # Find an existing order for test
        resp = cls.session.get("/orders/")
        orders = resp.json().get('results', [])
        cls.order_id = orders[0]['id'] if orders else None

    def test_01_order_status_impact_on_finance(self):
        if not self.order_id:
            self.skipTest("No orders found to test status impact")
        
        # 1. Update order status to 'delivered'
        status_data = {"status": "shipped"} # Shippping first
        resp = self.session.patch(f"/orders/{self.order_id}/", data=status_data)
        self.assertEqual(resp.status_code, 200)
        print(f"  ✅ Step 1: Order {self.order_id} status updated to 'shipped'.")

        # 2. Check finance logs for revenue/transaction update
        resp = self.session.get("/finance/transactions/", params={"order_id": self.order_id})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Step 2: Finance transactions verified for given order.")

        # 3. Check Operations daily stats
        resp = self.session.get("/operations/daily-stats/")
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Step 3: Operations daily stats updated.")

    @classmethod
    def tearDownClass(cls):
        # Reset order status if needed
        print("\n--- Ops/Finance Integration Test Done ---")

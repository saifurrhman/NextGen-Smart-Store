import unittest
from helpers import IntegrationSession

class TestVendorEarningsWorkflow(unittest.TestCase):
    """
    Integration Test: Vendor Earnings.
    Steps: Verify Earnings list -> Verify Transactions
    """
    
    @classmethod
    def setUpClass(cls):
        cls.session = IntegrationSession(email="vendor@nextgenstore.com", password="vendor123456")

    def test_01_earnings_verification(self):
        # 1. Get Earnings Overview
        resp = self.session.get("/vendors/earnings/overview/")
        self.assertIn(resp.status_code, [200, 404]) # Allow 404 if no data yet
        print("  ✅ Step 1: Earnings overview checked.")

        # 2. Get Earnings Transactions
        resp = self.session.get("/vendors/earnings/transactions/")
        self.assertEqual(resp.status_code, 200)
        print(f"  ✅ Step 2: Earnings transactions list retrieved: {len(resp.json())} items.")

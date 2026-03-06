import unittest
import time
from helpers import IntegrationSession

class TestVendorOnboardingWorkflow(unittest.TestCase):
    """
    Integration Test: Vendor Onboarding.
    Steps: Register -> Login -> Verify Profile
    """
    
    @classmethod
    def setUpClass(cls):
        cls.timestamp = int(time.time())
        cls.email = f"int-vendor-{cls.timestamp}@example.com"
        cls.password = "VendorPass123!"
        cls.session = None

    def test_01_onboarding_flow(self):
        # 1. Register as a Vendor
        reg_data = {
            "email": self.email,
            "password": self.password,
            "store_name": f"Integration Store {self.timestamp}",
            "phone_number": "1234567890"
        }
        # Note: adjust endpoint based on your vendor registration API
        from ..helpers import BASE_URL
        import requests
        resp = requests.post(f"{BASE_URL}/auth/register/", json=reg_data, timeout=15)
        self.assertIn(resp.status_code, [200, 201], f"Registration failed: {resp.text}")
        print(f"  ✅ Step 1: Vendor registered: {self.email}")

        # 2. Login
        self.session = IntegrationSession(email=self.email, password=self.password)
        self.assertIsNotNone(self.session.token)
        print("  ✅ Step 2: Vendor login successful.")

        # 3. Verify Profile Setup
        resp = self.session.get("/vendors/profile/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get('email'), self.email)
        print("  ✅ Step 3: Vendor profile verified.")

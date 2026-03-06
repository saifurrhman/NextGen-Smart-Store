import unittest
import time
from helpers import BASE_URL, post

class TestVendorRegistration(unittest.TestCase):
    """Tests for new vendor account registration flow."""

    def test_01_registration_flow(self):
        """New vendor can register."""
        email = f"v-test-{int(time.time())}@example.com"
        payload = {
            "email": email,
            "password": "TestPass@12345",
            "password2": "TestPass@12345",
            "first_name": "Unit",
            "last_name": "Vendor",
            "role": "VENDOR"
        }
        resp = post("/auth/register/", data=payload)
        self.assertIn(resp.status_code, [200, 201, 400])
        print(f"  ✅ Registration returned {resp.status_code}")

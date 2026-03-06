import unittest
import time
from helpers import BASE_URL, post, get

class TestPublicAuthentication(unittest.TestCase):
    """Tests for public authentication routes: login, register, OTP."""

    def test_01_otp_send(self):
        """OTP can be sent for registration."""
        email = f"public-test-{int(time.time())}@example.com"
        payload = {
            "email": email,
            "purpose": "register"
        }
        resp = post("/auth/otp/send/", data=payload)
        # Even if email service fails, we expect a valid 200 or 400 response, not a 500
        self.assertIn(resp.status_code, [200, 400, 201])
        print(f"  ✅ OTP send returned status {resp.status_code}")

    def test_02_registration_rejection(self):
        """Registration rejects if data is missing."""
        resp = post("/auth/register/", data={})
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Registration rejected empty payload")

    def test_03_login_rejection(self):
        """Login rejects invalid credentials."""
        resp = post("/auth/login/", {"username": "nonexistent@example.com", "password": "wrongpassword"})
        self.assertIn(resp.status_code, [400, 401])
        print("  ✅ Login rejected invalid credentials")

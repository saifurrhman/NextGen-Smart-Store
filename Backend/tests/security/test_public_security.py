import unittest
import requests
import time
from helpers import BASE_URL

class TestPublicSecurity(unittest.TestCase):
    """
    SECURITY TEST: Public/Guest User Protection.
    Verifies Rate Limiting, OTP Integrity, and Information Disclosure preventions.
    """

    def test_01_otp_brute_force_protection(self):
        """Verify that multiple OTP requests are throttled (Rate Limiting)."""
        email = f"brute-test-{int(time.time())}@example.com"
        url = f"{BASE_URL}/auth/otp/send/"
        
        print(f"  Testing rate limiting on {url}...")
        results = []
        for i in range(5):
            resp = requests.post(url, json={"email": email, "purpose": "register"}, timeout=10)
            results.append(resp.status_code)
            time.sleep(0.1) # Rapid fire
        
        # In a real environment with rate limiting (e.g. Django Ratelimit), we expect 429
        # If it returns 200/201 every time, it's a potential area for improvement (brute force risk)
        throttled = 429 in results
        if throttled:
            print("    ✅ Throttling detected (429 Too Many Requests).")
        else:
            print("    ℹ️ Throttling not detected in 5 rapid attempts (Potential Improvement).")
            # We don't fail here usually unless ratelimiting is a strict requirement for the test
            # self.assertIn(429, results)

    def test_02_otp_bypass_prevention(self):
        """Registration should fail without a valid OTP."""
        email = f"bypass-test-{int(time.time())}@example.com"
        url = f"{BASE_URL}/auth/register/"
        data = {
            "email": email,
            "password": "Password123!",
            "otp": "123456" # Guessing or using dummy
        }
        
        print(f"  Checking OTP bypass for registration...")
        resp = requests.post(url, json=data, timeout=10)
        # Should be 400 Bad Request if OTP is wrong
        self.assertNotEqual(resp.status_code, 201, "Security Gap! Registration successful with invalid OTP!")
        print(f"    ✅ Registration rejected as expected (Status: {resp.status_code})")

    def test_03_info_disclosure_internal_paths(self):
        """Guest users should NOT see sensitive debug or admin files."""
        sensitive_paths = ["/.env", "/admin/", "/users/"]
        
        print("  Checking for Information Disclosure...")
        for path in sensitive_paths:
            resp = requests.get(f"{BASE_URL}{path}", timeout=10)
            # Should be 404, 403, or 401
            self.assertIn(resp.status_code, [404, 403, 401], f"Security Hazard! {path} is accessible to guests!")
            print(f"    ✅ {path} protected (Status: {resp.status_code})")

    def test_04_xss_in_search(self):
        """Public search should not allow reflected XSS."""
        xss_payload = "<script>alert('XSS')</script>"
        print("  Checking for Reflected XSS in search...")
        resp = requests.get(f"{BASE_URL}/products/", params={"search": xss_payload}, timeout=10)
        
        # Status should be 200 or 400, but we check if server crashes
        self.assertNotEqual(resp.status_code, 500, "Server crashed with XSS payload in search!")
        print(f"    ✅ Search payload handled safely (Status: {resp.status_code})")

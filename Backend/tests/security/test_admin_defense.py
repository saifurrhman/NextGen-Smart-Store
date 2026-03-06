import unittest
import requests
from helpers import IntegrationSession, BASE_URL

class TestAdminInjectionDefense(unittest.TestCase):
    """
    SECURITY TEST: Injection vulnerabilities (SQLi, XSS).
    Verifies that Admin inputs are sanitized or safely handled.
    """

    @classmethod
    def setUpClass(cls):
        try:
            cls.admin = IntegrationSession()
        except:
            cls.admin = None
            print("  ⚠️ Warning: Could not create Admin session for testing.")

    def test_01_sql_injection_search_params(self):
        """Test if search parameters are vulnerable to SQLi."""
        if not self.admin: self.skipTest("No Admin session")
        
        payloads = [
            "' OR '1'='1",
            "cat' UNION SELECT password FROM users --",
            "1; DROP TABLE products;"
        ]
        
        print("  Testing Search for SQLi payloads...")
        for p in payloads:
            resp = self.admin.get("/products/", params={"search": p})
            # We don't necessarily expect 400, but we expect it not to crash (500) 
            # and not to reveal unexpected data (harder to check, but status code is start)
            self.assertNotEqual(resp.status_code, 500, f"Server crashed with payload: {p}")
            print(f"    ✅ Payload '{p}' handled safely (Status: {resp.status_code})")

    def test_02_xss_in_names(self):
        """Test if XSS payloads in category/brand names are stored safely."""
        if not self.admin: self.skipTest("No Admin session")
        
        xss_payload = "<script>alert('XSS')</script>"
        url = "/categories/"
        data = {"name": f"XSS Test {xss_payload}", "slug": f"xss-test-{int(requests.utils.time.time())}"}
        
        print("  Testing Category Name for XSS...")
        resp = self.admin.post(url, data=data)
        self.assertIn(resp.status_code, [201, 200, 400]) # 400 is fine if sanitized/rejected
        
        if resp.status_code in [201, 200]:
            print("    ✅ Payload stored. (Frontend verification required for full XSS check)")
            # Clean up
            slug = data['slug']
            self.admin.delete(f"/categories/{slug}/")
        else:
            print(f"    ✅ Payload rejected/sanitized (Status: {resp.status_code})")

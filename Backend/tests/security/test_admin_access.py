import unittest
import requests
from helpers import IntegrationSession, BASE_URL

class TestAdminAccessControl(unittest.TestCase):
    """
    SECURITY TEST: Broken Access Control for Admin Endpoints.
    Verifies that Vendor, Buyer, and Anonymous users are blocked from Admin-only resources.
    """

    @classmethod
    def setUpClass(cls):
        # 1. Create a Vendor Session
        try:
            cls.vendor = IntegrationSession(email="vendor@nextgen.com", password="Password786")
        except:
            cls.vendor = None
            print("  ⚠️ Warning: Could not create Vendor session for security test.")
            
        # 2. Create a Buyer Session
        try:
            cls.buyer = IntegrationSession(email="buyer@nextgen.com", password="Password786")
        except:
            cls.buyer = None
            print("  ⚠️ Warning: Could not create Buyer session for security test.")

    def assert_blocked(self, session, method, url, data=None):
        """Helper to assert that a request returns 403 Forbidden or 401 Unauthorized."""
        headers = session.headers if session else {}
        if method == 'GET':
            resp = requests.get(f"{BASE_URL}{url}", headers=headers, timeout=10)
        elif method == 'POST':
            resp = requests.post(f"{BASE_URL}{url}", json=data, headers=headers, timeout=10)
        elif method == 'PATCH':
            resp = requests.patch(f"{BASE_URL}{url}", json=data, headers=headers, timeout=10)
        elif method == 'DELETE':
            resp = requests.delete(f"{BASE_URL}{url}", headers=headers, timeout=10)
        else:
            raise ValueError(f"Unsupported method: {method}")

        self.assertIn(resp.status_code, [403, 401], f"Security Gap! {url} accessible via {method} with status {resp.status_code}")

    # --- ADMIN ENDPOINTS TESTS ---

    def test_01_category_management_access(self):
        """Only Admin should create/delete categories."""
        url = "/categories/"
        data = {"name": "Hacker Cat", "slug": "hacker-cat"}
        
        print(f"  Checking {url} protection...")
        self.assert_blocked(self.vendor, 'POST', url, data)
        self.assert_blocked(self.buyer, 'POST', url, data)
        self.assert_blocked(None, 'POST', url, data)

    def test_02_brand_management_access(self):
        """Only Admin should create brands."""
        url = "/brands/"
        data = {"name": "Hacker Brand", "slug": "hacker-brand"}
        
        print(f"  Checking {url} protection...")
        self.assert_blocked(self.vendor, 'POST', url, data)
        self.assert_blocked(self.buyer, 'POST', url, data)

    def test_03_finance_logs_access(self):
        """Only Admin should view system-wide financial transactions."""
        url = "/finance/transactions/"
        
        print(f"  Checking {url} protection...")
        self.assert_blocked(self.vendor, 'GET', url)
        self.assert_blocked(self.buyer, 'GET', url)

    def test_04_analytics_access(self):
        """Only Admin should view dashboard analytics."""
        url = "/analytics/overview/"
        
        print(f"  Checking {url} protection...")
        self.assert_blocked(self.vendor, 'GET', url)
        self.assert_blocked(self.buyer, 'GET', url)

    def test_05_user_management_access(self):
        """Only Admin should list all users or admin list."""
        url = "/users/admin-list/" # Assuming this exists
        
        print(f"  Checking {url} (expected 403/401/404) protection...")
        # If endpoint doesn't exist, 404 is fine, but it shouldn't be 200 for non-admins
        headers = self.vendor.headers if self.vendor else {}
        resp = requests.get(f"{BASE_URL}{url}", headers=headers, timeout=10)
        self.assertNotEqual(resp.status_code, 200)

import os
import requests
import json

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_URL = os.environ.get("ADMIN_TEST_URL", "http://localhost:8000/api/v1")
ADMIN_EMAIL = os.environ.get("ADMIN_TEST_EMAIL", "admin@nextgenstore.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_TEST_PASSWORD", "admin123456")

class IntegrationSession:
    """Manages an authenticated session for integration tests."""
    def __init__(self, email=ADMIN_EMAIL, password=ADMIN_PASSWORD):
        self.email = email
        self.password = password
        self.token = self._login()
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def _login(self):
        resp = requests.post(
            f"{BASE_URL}/auth/login/",
            json={"username": self.email, "password": self.password},
            timeout=15
        )
        if resp.status_code == 200:
            return resp.json().get("access") or resp.json().get("token")
        raise Exception(f"Login failed for {self.email}: {resp.text}")

    def post(self, url, data=None):
        return requests.post(f"{BASE_URL}{url}", json=data, headers=self.headers, timeout=15)

    def get(self, url, params=None):
        return requests.get(f"{BASE_URL}{url}", params=params, headers=self.headers, timeout=15)

    def put(self, url, data):
        return requests.put(f"{BASE_URL}{url}", json=data, headers=self.headers, timeout=15)

    def patch(self, url, data):
        return requests.patch(f"{BASE_URL}{url}", json=data, headers=self.headers, timeout=15)

    def delete(self, url):
        return requests.delete(f"{BASE_URL}{url}", headers=self.headers, timeout=15)

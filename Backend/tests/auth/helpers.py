import os
import time
import requests

# ─────────────────────────────────────────────────────────────────────────────
# Auth Test Helpers — NextGen Smart Store
# ─────────────────────────────────────────────────────────────────────────────

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:8000/api/v1")

# ── Default test credentials for each role ──────────────────────────────────
ADMIN_EMAIL    = os.environ.get("ADMIN_TEST_EMAIL",    "admin@nextgenstore.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_TEST_PASSWORD", "admin123456")

VENDOR_EMAIL    = os.environ.get("VENDOR_TEST_EMAIL",    "vendor@nextgenstore.com")
VENDOR_PASSWORD = os.environ.get("VENDOR_TEST_PASSWORD", "vendor123456")

DELIVERY_EMAIL    = os.environ.get("DELIVERY_TEST_EMAIL",    "delivery@nextgenstore.com")
DELIVERY_PASSWORD = os.environ.get("DELIVERY_TEST_PASSWORD", "delivery123456")

CUSTOMER_EMAIL    = os.environ.get("CUSTOMER_TEST_EMAIL",    "customer@nextgenstore.com")
CUSTOMER_PASSWORD = os.environ.get("CUSTOMER_TEST_PASSWORD", "customer123456")


def get_headers(token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def post(url, data=None, token=None):
    return requests.post(
        f"{BASE_URL}{url}",
        json=data,
        headers=get_headers(token),
        timeout=15,
    )


def get(url, token=None, params=None):
    return requests.get(
        f"{BASE_URL}{url}",
        headers=get_headers(token),
        params=params,
        timeout=15,
    )


def login(email, password):
    """Helper: Perform login and return the full response."""
    return post("/auth/login/", {"username": email, "password": password})


def get_token(email, password):
    """Helper: Perform login and return access token or None."""
    resp = login(email, password)
    if resp.status_code == 200:
        return resp.json().get("access")
    return None


def unique_email(prefix="test"):
    """Generate a unique test email using current timestamp."""
    return f"{prefix}-{int(time.time())}@testdomain.com"

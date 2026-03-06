import os
import requests
import unittest

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_URL = os.environ.get("DELIVERY_TEST_URL", "http://localhost:8000/api/v1")
DELIVERY_EMAIL = os.environ.get("DELIVERY_TEST_EMAIL", "delivery@nextgen.com")
DELIVERY_PASSWORD = os.environ.get("DELIVERY_TEST_PASSWORD", "Password786")

def get_auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def post(url, data=None, token=None, files=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if files:
        return requests.post(f"{BASE_URL}{url}", data=data, files=files, headers=headers, timeout=15)
    headers["Content-Type"] = "application/json"
    return requests.post(f"{BASE_URL}{url}", json=data, headers=headers, timeout=15)

def get(url, token=None, params=None):
    headers = get_auth_headers(token) if token else {}
    return requests.get(f"{BASE_URL}{url}", headers=headers, params=params, timeout=15)

def put(url, data, token=None):
    headers = get_auth_headers(token) if token else {"Content-Type": "application/json"}
    return requests.put(f"{BASE_URL}{url}", json=data, headers=headers, timeout=15)

def patch(url, data, token=None):
    headers = get_auth_headers(token) if token else {"Content-Type": "application/json"}
    return requests.patch(f"{BASE_URL}{url}", json=data, headers=headers, timeout=15)

def delete(url, token=None):
    headers = get_auth_headers(token) if token else {}
    return requests.delete(f"{BASE_URL}{url}", headers=headers, timeout=15)

def get_delivery_token():
    """Helper to get a fresh delivery token."""
    resp = post(
        "/auth/login/",
        {"username": DELIVERY_EMAIL, "password": DELIVERY_PASSWORD},
    )
    if resp.status_code == 200:
        return resp.json().get("access") or resp.json().get("token")
    return None

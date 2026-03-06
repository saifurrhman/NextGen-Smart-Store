import os
import requests
import unittest

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_URL = os.environ.get("ADMIN_TEST_URL", "http://localhost:8000/api/v1")
ADMIN_EMAIL = os.environ.get("ADMIN_TEST_EMAIL", "admin@nextgenstore.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_TEST_PASSWORD", "admin123456")

def get_auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def post(url, data=None, token=None, files=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if files:
        return requests.post(url, data=data, files=files, headers=headers, timeout=15)
    headers["Content-Type"] = "application/json"
    return requests.post(url, json=data, headers=headers, timeout=15)

def get(url, token=None, params=None):
    headers = get_auth_headers(token) if token else {}
    return requests.get(url, headers=headers, params=params, timeout=15)

def put(url, data, token=None):
    headers = get_auth_headers(token) if token else {"Content-Type": "application/json"}
    return requests.put(url, json=data, headers=headers, timeout=15)

def patch(url, data, token=None):
    headers = get_auth_headers(token) if token else {"Content-Type": "application/json"}
    return requests.patch(url, json=data, headers=headers, timeout=15)

def delete(url, token=None):
    headers = get_auth_headers(token) if token else {}
    return requests.delete(url, headers=headers, timeout=15)

def get_admin_token():
    """Helper to get a fresh admin token."""
    resp = post(
        f"{BASE_URL}/auth/login/",
        {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    if resp.status_code == 200:
        return resp.json().get("access")
    return None

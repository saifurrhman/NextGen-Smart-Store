import os
import requests
import unittest

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_URL = os.environ.get("PUBLIC_TEST_URL", "http://localhost:8000/api/v1")

def post(url, data=None, token=None, files=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if files:
        return requests.post(f"{BASE_URL}{url}", data=data, files=files, headers=headers, timeout=15)
    headers["Content-Type"] = "application/json"
    return requests.post(f"{BASE_URL}{url}", json=data, headers=headers, timeout=15)

def get(url, token=None, params=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.get(f"{BASE_URL}{url}", headers=headers, params=params, timeout=15)

def put(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.put(f"{BASE_URL}{url}", json=data, headers=headers, timeout=15)

def patch(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.patch(f"{BASE_URL}{url}", json=data, headers=headers, timeout=15)

def delete(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.delete(f"{BASE_URL}{url}", headers=headers, timeout=15)

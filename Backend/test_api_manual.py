
import requests
import json

url = "http://localhost:8000/api/v1/auth/otp/send/"
data = {
    "email": "new_user_test_unique_123@example.com",
    "purpose": "register"
}
headers = {
    "Content-Type": "application/json"
}

print(f"Sending POST to {url}...")
try:
    response = requests.post(url, json=data, headers=headers, timeout=15)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    print("Response Body:")
    print(response.text[:1000]) # Print first 1000 chars
except Exception as e:
    print(f"Request failed: {e}")

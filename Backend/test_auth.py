import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api/v1/auth'

def test_registration():
    url = f"{BASE_URL}/register/"
    data = {
        "username": "testuser_v1",
        "email": "testuser_v1@example.com",
        "password": "testpassword123",
        "phone": "1234567890",
        "address": "123 Test St"
    }
    print(f"Testing Registration: {url}")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login():
    url = f"{BASE_URL}/login/"
    data = {
        "email": "testuser_v1@example.com", # Assuming email login
        "password": "testpassword123"
    }
    # Try username login if email fails, depending on config
    print(f"Testing Login: {url}")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Login Successful!")
            print(f"Keys received: {response.json().keys()}")
            return True
        else:
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if test_registration():
        test_login()
    else:
        # If registration fails (maybe user exists), try login anyway
        print("Registration failed (maybe user exists), trying login...")
        test_login()

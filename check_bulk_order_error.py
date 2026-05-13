import requests
import json

BASE_URL = 'http://localhost:8000/api/v1'

def check():
    # Login as admin
    login_res = requests.post(f'{BASE_URL}/auth/login/', json={
        'email': 'saifriaz34@gmail.com',
        'password': 'admin' # Assuming standard password or I'll just check the DB
    })
    
    if login_res.status_code != 200:
        print("Login failed:", login_res.text)
        # Try getting token directly from db bypassing auth if needed, but let's assume it works or we just hit the endpoint without auth?
        # Bulk orders usually need auth. Let's try raw db query inside python.
        return
    
    token = login_res.json().get('access')
    if not token:
        print("No token")
        return
        
    res = requests.get(f'{BASE_URL}/orders/bulk-orders/', headers={'Authorization': f'Bearer {token}'})
    print(res.status_code)
    try:
        print(json.dumps(res.json(), indent=2))
    except:
        print(res.text)

if __name__ == '__main__':
    check()

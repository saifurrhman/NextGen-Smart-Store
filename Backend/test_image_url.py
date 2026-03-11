import requests
url = "http://localhost:8000/media/products/main/red-sneakers.png"
try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(f"Content Type: {response.headers.get('Content-Type')}")
    print(f"Size: {len(response.content)}")
except Exception as e:
    print(f"Error: {e}")

import urllib.request
import urllib.parse
import json
import random

def seed_api_traffic():
    sources = [
        ('google', 90),
        ('meta', 50),
        ('direct', 40),
        ('tiktok', 20)
    ]
    
    url = 'http://localhost:8000/api/v1/analytics/track_visit/'
    total = sum(count for _, count in sources)
    print(f"Sending {total} requests to {url}...")
    
    success = 0
    for source, count in sources:
        for _ in range(count):
            data = json.dumps({"source": source}).encode('utf-8')
            req = urllib.request.Request(
                url, 
                data=data, 
                headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
            )
            try:
                with urllib.request.urlopen(req) as response:
                    if response.status in [200, 201]:
                        success += 1
            except Exception as e:
                print(f"Error on {source}: {e}")
                break
                
    print(f"Successfully tracked {success} visits via API.")

if __name__ == '__main__':
    seed_api_traffic()

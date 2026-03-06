import concurrent.futures
import requests
import time
import os
import sys

# Add path for helpers
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(BACKEND_DIR, "tests", "integration"))

try:
    from helpers import BASE_URL
except ImportError:
    BASE_URL = "http://localhost:8000/api/v1"

def hit_endpoint(url):
    try:
        start = time.time()
        resp = requests.get(f"{BASE_URL}{url}", timeout=10)
        duration = time.time() - start
        return resp.status_code, duration
    except Exception as e:
        return 500, 0

def simulate_load(url, concurrent_users=10, total_requests=100):
    print(f"Simulating Load on {url}: {concurrent_users} users, {total_requests} total requests...")
    
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        futures = [executor.submit(hit_endpoint, url) for _ in range(total_requests)]
        results = [f.result() for f in concurrent.futures.as_completed(futures)]
    
    total_time = time.time() - start_time
    success_count = sum(1 for status, _ in results if 200 <= status < 300)
    error_count = total_requests - success_count
    avg_latency = sum(dur for _, dur in results) / total_requests * 1000
    rps = total_requests / total_time
    
    print("-" * 40)
    print(f"Results for {url}:")
    print(f"  Total Time: {total_time:.2f}s")
    print(f"  Avg Latency: {avg_latency:.2f}ms")
    print(f"  Throughput: {rps:.2f} req/s")
    print(f"  Success: {success_count} | Errors: {error_count}")
    print("-" * 40)
    
    return {
        "url": url,
        "rps": rps,
        "latency": avg_latency,
        "errors": error_count
    }

def main():
    print("="*80)
    print("  NextGen Smart Store — CONCURRENCY LOAD TESTING")
    print("="*80)
    
    # Test Public Discovery under load
    simulate_load("/products/", concurrent_users=20, total_requests=200)
    
    # Test Search Stress
    simulate_load("/products/?search=test", concurrent_users=15, total_requests=150)
    
    print("="*80)

if __name__ == "__main__":
    main()

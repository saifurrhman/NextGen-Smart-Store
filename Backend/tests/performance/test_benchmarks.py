import time
import statistics
import requests
import os
import sys

# Add path for helpers
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(BACKEND_DIR, "tests", "integration"))

try:
    from helpers import IntegrationSession, BASE_URL
except ImportError:
    BASE_URL = "http://localhost:8000/api/v1"

class PerformanceBenchmarker:
    def __init__(self):
        self.session = None
        try:
            self.session = IntegrationSession()
        except:
            print("⚠️ Authentication failed, running as anonymous user.")

    def measure_endpoint(self, method, url, name, data=None, iterations=10):
        print(f"Benchmarking {name} ({iterations} runs)...")
        latencies = []
        
        for _ in range(iterations):
            start = time.time()
            if method == 'GET':
                resp = requests.get(f"{BASE_URL}{url}", headers=self.session.headers if self.session else {}, timeout=15)
            elif method == 'POST':
                resp = requests.post(f"{BASE_URL}{url}", json=data, headers=self.session.headers if self.session else {}, timeout=15)
            
            latencies.append(time.time() - start)
            
        avg = statistics.mean(latencies) * 1000
        median = statistics.median(latencies) * 1000
        p95 = statistics.quantiles(latencies, n=20)[18] * 1000 if len(latencies) >= 20 else max(latencies) * 1000
        
        return {
            "name": name,
            "avg": avg,
            "median": median,
            "p95": p95,
            "status": "PASS" if avg < 500 else "SLOW"
        }

def run_benchmarks():
    bm = PerformanceBenchmarker()
    results = []
    
    # 1. Product Browsing (Public)
    results.append(bm.measure_endpoint('GET', '/products/', 'Product Listing', iterations=20))
    
    # 2. Search Performance
    results.append(bm.measure_endpoint('GET', '/products/?search=phone', 'Search Query', iterations=20))
    
    # 3. Category Listing
    results.append(bm.measure_endpoint('GET', '/categories/', 'Category List', iterations=15))
    
    # 4. Admin Analytics (If authenticated)
    if bm.session:
        results.append(bm.measure_endpoint('GET', '/analytics/overview/', 'Admin Analytics', iterations=10))
        results.append(bm.measure_endpoint('GET', '/finance/reports/', 'Finance Reports', iterations=10))

    print("\n" + "="*60)
    print(f"{'Endpoint':<25} | {'Avg(ms)':>8} | {'Med(ms)':>8} | {'Status':>8}")
    print("-" * 60)
    for r in results:
        print(f"{r['name']:<25} | {r['avg']:>8.2f} | {r['median']:>8.2f} | {r['status']:>8}")
    print("="*60)

if __name__ == "__main__":
    run_benchmarks()

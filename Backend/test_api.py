import urllib.request
import json

try:
    res = urllib.request.urlopen("http://localhost:8000/api/v1/products/")
    data = json.loads(res.read())
    if data["results"]:
        for p in data["results"]:
            print(f"Product ID: {p['id']}, Title: {p['title']}")
            try:
                res2 = urllib.request.urlopen(f"http://localhost:8000/api/v1/products/{p['id']}/")
                data2 = json.loads(res2.read())
                print(f"Fetch SUCCESS for ID {p['id']}: HTTP {res2.getcode()} Title: {data2.get('title')}")
            except Exception as ex:
                print(f"Fetch FAILED for ID {p['id']}: {ex}")
    else:
        print("No products in results.")
except Exception as e:
    print("Failed to list products:", e)

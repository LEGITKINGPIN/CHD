
import urllib.request
import urllib.error
import json

url = "http://localhost:8000/api/clusters"
data = {
    "algorithm": "HIERARCHICAL",
    "params": {"k": 5},
    "filter": "ALL",
    "district": "ALL",
    "dataset": "delhi"
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.getcode())
        result = json.loads(response.read().decode('utf-8'))
        print("Centroids:", result["centroids"])
except urllib.error.URLError as e:
    print(e)

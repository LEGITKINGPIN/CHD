
import urllib.request
import json

url = "http://localhost:8000/api/clusters"
payload = {
    "dataset": "delhi",
    "algorithm": "HIERARCHICAL",
    "params": {"k": 5},
    "filter": "ALL",
    "district": "ALL"
}
req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(response.getcode())
        # print(response.read().decode())
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode())
except Exception as e:
    print(e)

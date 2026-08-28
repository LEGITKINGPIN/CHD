
import requests

url = "http://localhost:8000/api/clusters"
payload = {
    "dataset": "delhi",
    "algorithm": "HIERARCHICAL",
    "params": {"k": 5},
    "filter": "ALL",
    "district": "ALL"
}
try:
    response = requests.post(url, json=payload)
    print(response.status_code)
    print(response.json())
except Exception as e:
    print(e)

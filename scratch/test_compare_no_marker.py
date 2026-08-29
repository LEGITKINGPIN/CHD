import requests

url = "http://localhost:8000/api/compare-clusters"
payload = {
    "dataset": "chicago",
    "algorithms": ["K-MEANS", "DBSCAN", "HIERARCHICAL"],
    "filter": ["ALL"],
    "district": ["ALL"],
    "arrest": ["ALL"],
    "customMarker": None
}
try:
    response = requests.post(url, json=payload)
    print(response.status_code)
    # print(response.json())
except Exception as e:
    print(e)

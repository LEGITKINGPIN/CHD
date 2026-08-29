import requests
import json
import time

def test_cluster(dataset):
    print(f"Testing {dataset}...")
    try:
        r = requests.post(
            "http://127.0.0.1:8000/api/clusters",
            json={"algorithm": "K-MEANS", "params": {"k": 5}, "dataset": dataset}
        )
        print(f"Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Error: {r.text[:500]}")
    except Exception as e:
        print(f"Exception: {e}")

test_cluster("chicago")
test_cluster("delhi")

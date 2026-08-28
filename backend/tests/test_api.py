from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_datasets():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5
    assert data[0]["key"] == "chicago"


def test_get_crimes():
    response = client.get("/api/crimes?dataset=chicago")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) > 0


def test_get_metadata():
    response = client.get("/api/metadata?dataset=chicago")
    assert response.status_code == 200
    meta = response.json()
    assert meta["totalCrimes"] > 0
    assert "dateRange" in meta
    assert "boundingBox" in meta
    assert "crimeTypes" in meta


def test_invalid_dataset():
    response = client.get("/api/crimes?dataset=invalid_key")
    assert response.status_code == 400
    assert "Unknown dataset key" in response.json()["detail"]


def test_clustering_kmeans():
    payload = {
        "algorithm": "K-MEANS",
        "params": {"k": 5},
        "filter": "ALL",
        "dataset": "chicago",
    }
    response = client.post("/api/clusters", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "labels" in data
    assert "centroids" in data
    assert "metrics" in data
    assert len(data["centroids"]) == 5


def test_predictions_endpoint():
    payload = {"dataset": "chicago"}
    response = client.post("/api/predictions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "metrics" in data
    assert "accuracy" in data["metrics"]
    assert "roc_auc" in data["metrics"]

import numpy as np

from backend.data_generator import generate_crime_data
from backend.ml_engine import run_clustering
from backend.risk_model import run_risk_prediction_pipeline


def test_metrics_undefined():
    # 2 points = 1 DBSCAN cluster (all noise if minPts > 2)
    coords = np.array([[41.8, -87.6], [41.81, -87.61]])

    labels, centroids, metrics = run_clustering(
        coords, "DBSCAN", {"eps": 10, "minPts": 5}
    )

    # 2 points with minPts=5 -> all noise -> numClusters=0
    assert metrics["numClusters"] == 0
    assert metrics["numNoise"] == 2
    assert metrics["silhouette"] is None
    assert metrics["daviesBouldin"] is None
    assert metrics["calinskiHarabasz"] is None


def test_rf_determinism():
    data = generate_crime_data(500, seed=42)
    crimes = [d.dict() for d in data]

    res1 = run_risk_prediction_pipeline(crimes)
    res2 = run_risk_prediction_pipeline(crimes)

    assert res1["metrics"]["accuracy"] == res2["metrics"]["accuracy"]
    assert res1["metrics"]["roc_auc"] == res2["metrics"]["roc_auc"]

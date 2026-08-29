import numpy as np

from backend.ml_engine import run_clustering


def test_kmeans_clustering():
    # Simple synthetic coords
    coords = np.array(
        [
            [41.8, -87.6],
            [41.81, -87.61],
            [41.79, -87.59],  # Cluster 1
            [41.9, -87.7],
            [41.91, -87.71],
            [41.89, -87.69],  # Cluster 2
        ]
    )

    labels, centroids, metrics, hotspot_rankings = run_clustering(coords, "K-MEANS", {"k": 2})

    assert len(set(labels)) == 2
    assert len(centroids) == 2
    assert metrics["numClusters"] == 2
    assert metrics["silhouette"] > 0.5  # Should be well separated


def test_dbscan_clustering():
    coords = np.array(
        [
            [41.8, -87.6],
            [41.801, -87.601],
            [41.799, -87.599],  # Cluster 1
            [41.9, -87.7],
            [41.901, -87.701],
            [41.899, -87.699],  # Cluster 2
        ]
    )

    labels, centroids, metrics, hotspot_rankings = run_clustering(
        coords, "DBSCAN", {"eps": 1.0, "minPts": 3}
    )

    assert len(set(labels)) == 2
    assert len(centroids) == 2
    assert metrics["numClusters"] == 2
    assert metrics["numNoise"] == 0


def test_degenerate_clusters():
    # Only one cluster possible
    coords = np.array([[41.8, -87.6], [41.8, -87.6]])
    labels, centroids, metrics, hotspot_rankings = run_clustering(coords, "K-MEANS", {"k": 1})

    assert len(set(labels)) == 1
    # Metrics like silhouette might be 0.0 or undefined, handled gracefully
    assert metrics["silhouette"] is None

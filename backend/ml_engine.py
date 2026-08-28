import time
from typing import Any

import numpy as np
import pyproj
from sklearn.cluster import DBSCAN, AgglomerativeClustering, KMeans
from sklearn.metrics import (
    calinski_harabasz_score,
    davies_bouldin_score,
    silhouette_score,
)

# Set up CRS transformer: WGS84 (Lat/Lng) to EPSG:32616 (UTM Zone 16N, suitable for Chicago)
transformer = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:32616", always_xy=True)


def run_clustering(
    coords: np.ndarray, algorithm: str, params: dict[str, Any]
) -> tuple[np.ndarray, np.ndarray, dict[str, float]]:

    start_time = time.time()

    # coords are shape (n_samples, 2), specifically [lng, lat] for xy.
    # But usually frontend provides [lat, lng]. We expect [lat, lng] as input to this function.

    if algorithm == "K-MEANS":
        # K-Means requires a projected CRS for euclidean distance to be meaningful
        lons = coords[:, 1]
        lats = coords[:, 0]
        x, y = transformer.transform(lons, lats)
        projected_coords = np.column_stack((x, y))

        k = params.get("k", 5)
        kmeans = KMeans(
            n_clusters=k, random_state=params.get("seed", 42), n_init="auto"
        )
        labels = kmeans.fit_predict(projected_coords)

        # Centroids back to lat/lng
        centroids_proj = kmeans.cluster_centers_
        c_lon, c_lat = pyproj.Transformer.from_crs(
            "EPSG:32616", "EPSG:4326", always_xy=True
        ).transform(centroids_proj[:, 0], centroids_proj[:, 1])
        centroids = np.column_stack((c_lat, c_lon))

        # For metrics, we use the projected coords
        eval_coords = projected_coords

    elif algorithm == "DBSCAN":
        # DBSCAN with Haversine on radians
        # coords are [lat, lng]
        coords_rad = np.radians(coords)

        # eps in params might be in km or degrees. Let's assume eps is in kilometers for UX.
        eps_km = params.get("eps", 0.5)
        eps_rad = eps_km / 6371.0  # Earth radius in km
        min_samples = params.get("minPts", 10)

        dbscan = DBSCAN(eps=eps_rad, min_samples=min_samples, metric="haversine")
        labels = dbscan.fit_predict(coords_rad)

        # Calculate derived centroids using projected CRS for geometric correctness
        centroids = []
        unique_labels = set(labels)
        for label in unique_labels:
            if label != -1:
                cluster_points = coords[labels == label]
                lons = cluster_points[:, 1]
                lats = cluster_points[:, 0]
                x, y = transformer.transform(lons, lats)
                mean_x, mean_y = np.mean(x), np.mean(y)
                c_lon, c_lat = pyproj.Transformer.from_crs(
                    "EPSG:32616", "EPSG:4326", always_xy=True
                ).transform(mean_x, mean_y)
                centroids.append([c_lat, c_lon])
        if len(centroids) == 0:
            centroids = np.array([])
        else:
            centroids = np.array(centroids)

        eval_coords = coords_rad

    elif algorithm == "HIERARCHICAL":
        lons = coords[:, 1]
        lats = coords[:, 0]
        x, y = transformer.transform(lons, lats)
        projected_coords = np.column_stack((x, y))

        k = params.get("k", 5)
        # Use Ward linkage on Euclidean projected coordinates (UTM) for superior spatial clustering
        agg = AgglomerativeClustering(n_clusters=k, metric="euclidean", linkage="ward")
        labels = agg.fit_predict(projected_coords)

        # Calculate derived centroids using projected CRS for geometric correctness
        centroids = []
        unique_labels = set(labels)
        for label in unique_labels:
            if label != -1:
                cluster_points = coords[labels == label]
                lons_c = cluster_points[:, 1]
                lats_c = cluster_points[:, 0]
                x_c, y_c = transformer.transform(lons_c, lats_c)
                mean_x, mean_y = np.mean(x_c), np.mean(y_c)
                c_lon, c_lat = pyproj.Transformer.from_crs(
                    "EPSG:32616", "EPSG:4326", always_xy=True
                ).transform(mean_x, mean_y)
                centroids.append([c_lat, c_lon])
        centroids = np.array(centroids)

        eval_coords = projected_coords
    else:
        raise ValueError(f"Unknown algorithm {algorithm}")

    # Calculate metrics
    num_clusters = len(set(labels) - {-1})
    num_noise = np.sum(labels == -1)

    silhouette = None
    davies = None
    calinski = None

    if num_clusters > 1:
        # Ignore noise points for metric calculation if desired, or include them as a separate cluster.
        # Usually, metrics are calculated on clustered points only.
        mask = labels != -1
        if np.sum(mask) > num_clusters:  # Need at least some points
            filtered_coords = eval_coords[mask]
            filtered_labels = labels[mask]

            # For Silhouette, Haversine is supported by sklearn.
            # For DB and CH, they require Euclidean distance inherently (they are variance based).
            # Therefore, we project the points to calculate DB and CH properly.
            metric_arg = (
                "euclidean" if algorithm in ["K-MEANS", "HIERARCHICAL"] else "haversine"
            )
            silhouette = silhouette_score(
                filtered_coords, filtered_labels, metric=metric_arg
            )

            if algorithm == "DBSCAN":
                # Revert from radians to degrees for projection
                filtered_deg = np.degrees(filtered_coords)
                x, y = transformer.transform(filtered_deg[:, 1], filtered_deg[:, 0])
                projected_for_variance = np.column_stack((x, y))
            else:
                projected_for_variance = filtered_coords

            davies = davies_bouldin_score(projected_for_variance, filtered_labels)
            calinski = calinski_harabasz_score(projected_for_variance, filtered_labels)

    runtime_ms = (time.time() - start_time) * 1000

    metrics = {
        "silhouette": float(silhouette) if silhouette is not None else None,
        "daviesBouldin": float(davies) if davies is not None else None,
        "calinskiHarabasz": float(calinski) if calinski is not None else None,
        "numClusters": int(num_clusters),
        "numNoise": int(num_noise),
        "runtimeMs": float(runtime_ms),
    }

    return labels, centroids, metrics

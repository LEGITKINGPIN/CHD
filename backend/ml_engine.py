import time
from typing import Any

import numpy as np
import pyproj
from scipy.spatial import ConvexHull
from sklearn.cluster import DBSCAN, AgglomerativeClustering, KMeans
from sklearn.metrics import (
    calinski_harabasz_score,
    davies_bouldin_score,
    silhouette_score,
)

# Set up CRS transformer: WGS84 (Lat/Lng) to EPSG:32616 (UTM Zone 16N, suitable for Chicago)
transformer = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:32616", always_xy=True)


def calculate_cluster_convex_hull_area(latitudes, longitudes):
    """
    Calculates approximate area (in sq km) of a spatial cluster using Convex Hull.
    """
    if len(latitudes) < 3:
        return 0.05  # Default minimal area in km^2
        
    points = np.column_stack((latitudes, longitudes))
    try:
        hull = ConvexHull(points)
        # Approximate conversion from degree area to km^2 at lat ~ 41.88
        mean_lat = np.mean(latitudes)
        lat_dist_km = 111.13
        lon_dist_km = 111.13 * np.cos(np.radians(mean_lat))
        area_sq_km = hull.volume * lat_dist_km * lon_dist_km
        return max(area_sq_km, 0.05)
    except Exception:
        return 0.1


def run_clustering(
    coords: np.ndarray, algorithm: str, params: dict[str, Any], extra_data: list[dict] = None
) -> tuple[np.ndarray, np.ndarray, dict[str, float]]:

    start_time = time.time()

    algorithm = algorithm.upper()

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

    # Calculate Hotspot Rankings
    hotspot_rankings = []
    unique_labels = set(labels)
    for c in unique_labels:
        if c == -1:
            continue
        
        mask = labels == c
        cluster_points = coords[mask]
        volume = len(cluster_points)
        
        if volume < 5:  # Minimum volume for ranking consideration
            continue
            
        area_km2 = calculate_cluster_convex_hull_area(cluster_points[:, 0], cluster_points[:, 1])
        density = volume / area_km2
        intensity_score = volume * np.log1p(density)
        
        risk_category = "Critical Hotspot" if density > 500 else ("High Risk" if density > 200 else "Moderate Risk")
        
        dominant_crime = "Unknown"
        peak_hour = "Unknown"
        peak_day = "Unknown"
        insight = "Not enough data for insights."
        
        if extra_data is not None:
            cluster_extras = [extra_data[i] for i, m in enumerate(mask) if m]
            
            # Dominant crime
            crimes = {}
            hours = {}
            days = {}
            for e in cluster_extras:
                ct = e.get("primary_type", "Unknown")
                hr = e.get("hour", -1)
                dy = e.get("day_of_week", "Unknown")
                
                crimes[ct] = crimes.get(ct, 0) + 1
                if hr != -1: hours[hr] = hours.get(hr, 0) + 1
                if dy != "Unknown": days[dy] = days.get(dy, 0) + 1
                
            if crimes:
                dominant_crime = max(crimes.items(), key=lambda x: x[1])[0]
            if hours:
                peak_h = max(hours.items(), key=lambda x: x[1])[0]
                peak_hour = f"{peak_h:02d}:00 - {(peak_h+1)%24:02d}:00"
            if days:
                peak_day = max(days.items(), key=lambda x: x[1])[0]
                
            insight = f"Historical pattern indicates concentrated {dominant_crime} activity, peaking on {peak_day}s during {peak_hour}."

        hotspot_rankings.append({
            "cluster_id": int(c),
            "volume": int(volume),
            "area_sq_km": float(round(area_km2, 3)),
            "density_per_km2": float(round(density, 1)),
            "intensity_score": float(round(intensity_score, 2)),
            "risk_category": risk_category,
            "dominant_crime": dominant_crime,
            "peak_hour": peak_hour,
            "peak_day": peak_day,
            "insight": insight
        })
        
    hotspot_rankings = sorted(hotspot_rankings, key=lambda x: x["intensity_score"], reverse=True)

    return labels, centroids, metrics, hotspot_rankings

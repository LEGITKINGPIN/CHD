# Methodology

## Overview
The Crime Hotspot Detection (CHD) platform provides spatial clustering, hotspot ranking, and historical risk analytics for urban crime, delivered through a production-grade web GIS interface.

## 1. Data Sources & Normalization
- **NCRB-style Synthetic Datasets**: Delhi, Mumbai, Bengaluru, and National aggregates (up to 5,000 records each). Temporal biases (seasonality, day-of-week, hour-of-day) are injected during generation to simulate real-world heuristics.
- **Custom CSV Upload**: Users may upload their own datasets, which are normalized by the `DatasetLoader` pipeline into a canonical schema (`lat`, `lng`, `primary_type`, `date`, `district`, `arrest`).
- **Socrata Live API Ingestion**: Live crime feed ingestion via any Socrata-compatible Open Data endpoint, supporting real-time dataset registration.

## 2. Spatial Clustering & Hotspot Ranking
- **K-Means**: Standard Cartesian clustering in a projected EPSG:32616 coordinate system. Optimal for well-separated, roughly spherical cluster shapes.
- **DBSCAN**: Density-based clustering using spherical Haversine distance to accurately account for Earth's curvature. Handles noise (outlier points labeled -1) and arbitrary cluster shapes.
- **Hierarchical Clustering (Complete Linkage)**: Agglomerative clustering producing compact, spherical clusters. Dynamically down-sampled when N > 1,500 to manage O(n²) time complexity.
- **Local Clustering (Client-Side)**: K-Means, DBSCAN, and Hierarchical clustering executed in-browser using Turf.js within a user-defined radius around any map point.
- **Hotspot Ranking**: Each cluster's geospatial boundary is extracted as a Convex Hull using `scipy.spatial.ConvexHull`. Spatial area (KM²) is calculated via planar projection, then used to compute a Crimes per KM² Intensity Score and categorical risk label (Critical Hotspot / High Risk / Medium Risk).

## 3. Algorithm Comparison
Concurrent execution of all three algorithms is supported via the `/api/compare-clusters` endpoint. Each algorithm run returns:
- Silhouette Score
- Davies-Bouldin Index
- Calinski-Harabasz Index
- Runtime (ms)
- Cluster count
- Noise point ratio (DBSCAN)

Metrics are computed after transforming coordinates to an appropriate planar CRS for mathematical correctness.

## 4. Predictive Classification (Spatial Grid Aggregation)
A Random Forest classification pipeline predicts relative risk at spatial grid resolution:
1. The study area is divided into discrete ~1km² grid cells (0.01° resolution).
2. Historical crime incidents are aggregated per grid cell (volume, violent crime ratio, temporal ratios).
3. Grids are labeled into relative risk categories (Low, Medium, High) via quantile distributions of historical volume.
4. Random Forest classifies expected risk level based on these historical spatial features.

## 5. GIS Visualization
- **MapLibre GL JS** renders all geospatial data client-side via WebGL, achieving smooth 60fps interaction on 5,000+ points.
- Hotspot boundaries are drawn as **Convex Hulls** via Turf.js `convex()`, chosen for geometric robustness over concave hulls (which fail on sparse clusters with <4 points).
- Heatmap density layers, cluster-colored point layers, and area radius overlays provide multi-layer spatial context.

## 6. System Architecture
- **Frontend**: Next.js 15 App Router (`src/app/page.tsx` → `src/App.tsx` → component tree). MapLibre loaded client-side only via `next/dynamic({ ssr: false })`.
- **Backend**: FastAPI (Python), asynchronous, with `ThreadPoolExecutor` for CPU-bound ML tasks and a concurrency semaphore preventing CPU exhaustion.
- **API Proxy**: In development, Next.js rewrites `/api/*` → FastAPI at `localhost:8000`. In production, `FASTAPI_URL` environment variable routes directly to the Render backend, bypassing Vercel's proxy timeout limit.
- **Deployment**: Vercel (frontend, auto-deploy from `main`) + Render (backend, auto-deploy from `main`).

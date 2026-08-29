# Research Paper Outline

1. **Abstract**
   - Summary of the problem, proposed WebGL-accelerated crime intelligence platform, ML algorithms tested (K-Means, DBSCAN, Hierarchical), and main findings for scalable spatial intelligence.

2. **Introduction**
   - The need for real-time spatial intelligence in urban crime analysis.
   - Shift from static dashboards to interactive WebGL GIS environments.
   - Overview of the five-panel platform: Map, EDA, Trends, Algorithm Comparison, Patrol Intelligence.

3. **Problem Statement & Research Gap**
   - Previous studies evaluate ML models in offline environments (Jupyter/Streamlit), suffering from latency and poor UX when mapping thousands of points.
   - Gap: Lack of tightly integrated spatial clustering engines bridging Python-based analytics with production-grade web GIS primitives.

4. **Literature Review**
   - Integration of findings from a 20-paper corpus on spatial criminology (e.g., Butt 2020, Zhang 2020).
   - Historical use of K-Means, DBSCAN, and Hierarchical Clustering in criminology.
   - Evolution of web mapping from server-rendered tiles to client-side vector rendering (MapLibre GL JS).

5. **Proposed System Architecture**
   - **Frontend**: Next.js 15 App Router (migrated from Vite/React for production-grade SSR capability and integrated API proxying).
   - **Backend**: FastAPI (Python) with asynchronous `ThreadPoolExecutor` for CPU-bound ML tasks.
   - **Deployment**: Vercel (frontend) + Render (backend), with environment-variable-driven API routing via `FASTAPI_URL`.
   - **Dataset Support**: NCRB-style synthetic datasets (Delhi, Mumbai, Bengaluru, National), custom CSV upload, and Socrata live API ingestion.

6. **Methodology**
   - NCRB-style dataset normalization and coordinate standardization.
   - FastAPI ML pipeline using `scikit-learn` and `scipy`.
   - Precise geospatial boundary extraction using Turf.js convex hulls in the browser.
   - Grid-Based Spatial Risk Prediction: 1km² grid cell aggregation for Random Forest classification.

7. **Spatial Analysis & Clustering Algorithms**
   - K-Means: standard Cartesian clustering (EPSG:32616 projected CRS).
   - DBSCAN: density-based clustering using Haversine distance, spherically corrected.
   - Hierarchical Clustering (Complete Linkage): dynamically down-sampled for O(n²) time complexity management.
   - Local DBSCAN / K-Means / Hierarchical: client-side clustering within a user-defined radius (Turf.js).
   - Hotspot Ranking: Convex Hull area via `scipy.spatial.ConvexHull`, producing Crimes per KM² Intensity Score.

8. **Experimental Setup**
   - Datasets: Indian NCRB Crime Samples up to 5,000 records.
   - Runtime environment: FastAPI + Next.js 15 (dev and production builds).
   - Evaluation metrics: Silhouette Score, Davies-Bouldin Index, Calinski-Harabasz Index, runtime (ms), cluster count, noise point ratio.

9. **Results & Model Evaluation**
   - Silhouette and Davies-Bouldin comparisons across K-Means, DBSCAN, and Hierarchical via the Algorithm Comparison panel.
   - WebGL rendering performance: smooth 60fps interaction on 5,000+ interactive map points.
   - *(Quantitative results pending formal experiment run — see EXPERIMENTS.md)*

10. **Discussion**
    - Density-based models (DBSCAN) fit crime data better than partition-based models in high-variance urban distributions.
    - UX implications: convex hull boundaries, interactive point inspection, and local area analysis surpass static scatter plots.
    - Next.js App Router benefit: built-in API proxying eliminates CORS issues; direct backend routing bypasses Vercel's proxy timeout limit.

11. **Limitations & Future Work**
    - Local clustering currently uses Euclidean approximation; future versions should use Haversine consistently on the client side.
    - Future: temporal RNNs for predictive policing; user authentication for restricted police datasets.

12. **Conclusion**
    - The CHD (Crime Hotspot Detection) platform bridges the gap between academic spatial clustering research and production-grade GIS software, deployable as a full-stack web service on standard cloud infrastructure.

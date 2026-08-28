# Research Paper Outline

1. **Abstract**
   - Summary of the problem, proposed WebGL-accelerated platform, ML algorithms tested (K-Means, DBSCAN, Hierarchical), and main findings for scalable spatial intelligence.

2. **Introduction**
   - The need for real-time spatial intelligence in urban crime analysis.
   - Shift from static dashboards to interactive WebGL GIS environments.

3. **Problem Statement & Research Gap**
   - Previous studies often evaluate ML models in offline environments (Jupyter/Streamlit), which suffer from latency and poor user experience when mapping thousands of points.
   - Gap: Lack of tightly integrated spatial clustering engines bridging powerful Python-based analytics with modern web UI primitives.

4. **Literature Review**
   - Integration of findings from a 20-paper corpus on spatial criminology (e.g., Butt 2020, Zhang 2020).
   - Historical use of K-Means, DBSCAN, and Hierarchical Clustering in criminology, distinguishing literature findings from our project's results.
   - Evolution of web mapping from server-rendered tiles to client-side vector (MapLibre/Mapbox).

5. **Proposed Methodology**
   - NCRB-style Dataset generation and normalization across Indian cities.
   - High-performance FastAPI (Python) backend utilizing `scikit-learn` for ML computations.
   - Precise geospatial mapping using UTM projections and Convex hull boundary extraction via Turf.js.

6. **Spatial Analysis & Clustering Algorithms**
   - K-Means formulation for spatial grids.
   - DBSCAN density definitions and parameter selection.
   - Hierarchical Clustering (Ward Linkage) and dynamic down-sampling for O(n^2) time complexity management.

7. **Experimental Setup**
   - Indian NCRB Crime Samples (Delhi, Mumbai, Bengaluru, and Whole India) up to 5,000 points.
   - FastAPI and React/Vite runtime metrics.

8. **Results & Model Evaluation**
   - Silhouette and Davies-Bouldin comparisons across algorithms.
   - WebGL rendering performance optimizations (achieving smooth 60fps panning on 5000+ interactive points by debouncing React state updates).

9. **Discussion**
   - Why density-based models fit crime data better than partition-based models.
   - UX implications: The importance of convex hulls, detailed interactive point inspection, and optimized map movement over static scatter plots.

10. **Limitations & Future Work**
    - Local Euclidean distance limitations vs Haversine metrics.
    - Future integration of temporal Recurrent Neural Networks (RNNs) for predictive policing.

11. **Conclusion**
    - The SpatialIntell platform successfully bridges the gap between academic spatial clustering and production-grade GIS software.

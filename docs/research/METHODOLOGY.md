# Methodology

## Overview
SpatialIntell aims to provide predictive risk analytics and spatial clustering for urban crime.

## 1. Synthetic Data Generation
We generated synthetic data over a realistic geographic boundary. Temporal biases (seasonality, day-of-week, hour-of-day) were explicitly injected into the generation process to simulate known real-world heuristics.

## 2. Spatial Clustering
- **K-Means**: Standard Cartesian clustering in a projected EPSG:32616 coordinate system.
- **DBSCAN / Hierarchical**: Density-based clustering using spherical geometry (Haversine distance) to accurately account for earth curvature. Centroids and evaluation metrics (Davies-Bouldin, Calinski-Harabasz) are geometrically corrected via planar projection.

## 3. Predictive Classification (Architectural Demonstration)
A Random Forest classification pipeline was implemented to predict a heuristic risk class.
**Important Methodological Limitation**: Because the primary dataset is generated synthetically, the prediction target (risk class) is mathematically derived from the exact same synthetic spatial and temporal predictor features (e.g., time of day, month, weekend status). Therefore, predicting this target is a tautological task. 

The Random Forest model is retained in the codebase strictly as a **structural architectural demonstration** to show how the pipeline *would* ingest features, split chronologically, and evaluate predictions if provided with real ground-truth data. Its performance metrics (e.g., accuracy, ROC-AUC) must **not** be interpreted as evidence of genuine real-world crime prediction capability.

## GIS Visualization
Hotspot boundaries are generated using Turf.js `convex` hulls. While `concave` hulls (or alpha shapes) provide tighter boundaries for irregular DBSCAN clusters, convex hulls were chosen as a robust fallback to prevent geometric invalidity (e.g., overlapping polygons or failures on sparse clusters with < 4 points).

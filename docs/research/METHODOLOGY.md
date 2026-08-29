# Methodology

## Overview
SpatialIntell aims to provide predictive risk analytics and spatial clustering for urban crime.

## 1. Synthetic Data Generation
We generated synthetic data over a realistic geographic boundary. Temporal biases (seasonality, day-of-week, hour-of-day) were explicitly injected into the generation process to simulate known real-world heuristics. The system now additionally supports custom data ingestion (CSV uploads) and real-time live data endpoints to test against genuine distributions.

## 2. Spatial Clustering & Hotspot Ranking
- **K-Means**: Standard Cartesian clustering in a projected EPSG:32616 coordinate system.
- **DBSCAN / Hierarchical**: Density-based clustering using spherical geometry (Haversine distance) to accurately account for earth curvature. Centroids and evaluation metrics (Davies-Bouldin, Calinski-Harabasz) are geometrically corrected via planar projection.
- **Hotspot Ranking**: Clusters (specifically density-based clusters) are quantified by calculating their geospatial area using Convex Hulls. The spatial density (Crimes per KM²) is computed to establish a measurable Hotspot Intensity Score.

## 3. Predictive Classification (Spatial Grid Aggregation)
A Random Forest classification pipeline is implemented to predict risk.
Previously, the model synthesized a deterministic target. The methodology has been updated to use **Spatial Grid Aggregation**:
1. The study area is divided into discrete ~1km² grid cells (0.01 degree resolution).
2. Historical crime incidents are aggregated into these grids to calculate spatial volume, violent crime ratios, and temporal ratios.
3. Grids are labeled into relative risk categories (Low, Medium, High) based on quantile distributions of historical volume.
4. A Random Forest model classifies the expected risk level of a spatial grid based on these historical features.

This approach grounds the predictive capability in actual spatial density rather than purely synthetic derivation.

## GIS Visualization
Hotspot boundaries are generated using Turf.js `convex` hulls. While `concave` hulls (or alpha shapes) provide tighter boundaries for irregular DBSCAN clusters, convex hulls were chosen as a robust fallback to prevent geometric invalidity (e.g., overlapping polygons or failures on sparse clusters with < 4 points).

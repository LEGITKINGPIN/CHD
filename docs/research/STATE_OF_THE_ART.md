# State of the Art Analysis

## 1. What has existing literature already achieved?
Existing literature successfully applies clustering (DBSCAN, K-Means) and predictive modeling (LSTM, Random Forest) to historical crime datasets to identify hotspots.

## 2. Which algorithms are commonly used?
LSTM, DBSCAN, Random Forest, SVM, CNN, and K-Means (based on source extractions).

## 3. Which datasets are commonly used?
Chicago and New York open data portals, alongside Twitter sentiment data.

## 4. Which spatial methods are used?
Kernel Density Estimation (KDE), spatial-temporal grids, and basic geospatial coordinates.

## 5. Which temporal methods are used?
RNNs/LSTMs applied to time-series windows.

## 6. Which metrics are used?
NOT SPECIFIED IN SOURCE (Requires deeper manual extraction).

## 7. What limitations recur?
Lack of integrated spatial distance metrics (e.g., using Euclidean on Lat/Lng blindly) and computational scaling issues on massive datasets.

## 8. What methodological gaps are actually supported?
The literature shows a gap in systems that dynamically compute true geodesic (Haversine) clustering in real-time web applications with explicit geometric metrics (Silhouette, Davies-Bouldin) exposed to the user.

## 9. Where does SpatialIntell fit?
SpatialIntell implements a rigorously validated backend (Scikit-Learn) with projected CRS and Haversine distances to solve the geometric inaccuracies identified in naive web implementations.

## 10. What can SpatialIntell legitimately claim?
SpatialIntell provides a reproducible, GIS-correct, and empirically evaluated approach to crime hotspot analysis that bridges the gap between static academic scripts and interactive analytical platforms.

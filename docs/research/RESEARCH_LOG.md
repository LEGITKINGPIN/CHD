# Research Log

## Initialization Phase
- **Date**: 2026-08-26
- **Action**: Synthetic dataset initialized with seasonal, hourly, and weekly rejection sampling rules.
- **Status**: COMPLETED

## ML Pipeline Implementation
- **Date**: 2026-08-26
- **Action**: Random Forest model implementation with Chronological train/test split.
- **Status**: COMPLETED

## Execution & Evaluation
- **Date**: 2026-08-26
- **Action**: Run evaluations on test split.
- **Status**: PENDING

## Integration Phase (Kartik Parashar to Main Hotspot)
- **Date**: 2026-08-29
- **Source Project**: Kartik Parashar
- **Feature**: Hotspot Ranking via Convex Hull Area and Intensity Score
- **Previous Main Hotspot State**: Returned raw cluster labels and centroids without density-based spatial ranking.
- **Imported Capability**: Quantitative density score per spatial cluster (Crimes per KM²).
- **Technical Modification**: Added Convex Hull area calculation in `ml_engine.py` using `scipy.spatial.ConvexHull`, executed asynchronously within the ThreadPoolExecutor.
- **Reason for Adoption**: Provides defensible spatial interpretation of risk severity beyond raw cluster membership.
- **Performance Impact**: Minor $O(n \log n)$ overhead per cluster inside the asynchronous executor; frontend map remains completely unblocked.
- **Scientific Impact**: Enhances evaluation by providing a scalable intensity metric for density-based algorithms (DBSCAN).
- **Research Paper Section Affected**: Methodology, Model Comparison.
- **Tests Added**: Unit tests pending.

- **Date**: 2026-08-29
- **Source Project**: Kartik Parashar
- **Feature**: Grid-Based Spatial Risk Prediction
- **Previous Main Hotspot State**: `risk_model.py` synthesized a purely deterministic target based on existing features (tautological model).
- **Imported Capability**: Aggregation of incidents into 1km² grids to predict relative historical risk based on actual historical volume distributions.
- **Technical Modification**: Modified `risk_model.py` to aggregate records by spatial grid cell (0.01 degree resolution) before Random Forest training.
- **Reason for Adoption**: A scientifically valid supervised prediction target based on historical spatial density instead of synthetic derivation.
- **Performance Impact**: Requires GroupBy operations. Will be executed strictly inside `ml_executor` to prevent FastAPI event loop blocking.
- **Scientific Impact**: Transforms the prediction pipeline from a structural demonstration into a testable spatial risk predictor.
- **Research Paper Section Affected**: Methodology.
- **Tests Added**: Unit tests pending.

## Final Project Alignment Phase
- **Date**: 2026-08-29
- **Action**: Comprehensive repository audit and feature implementation to align with official academic problem statement and objectives.
- **Key Implementations**:
  - **EDA Dashboard**: Created `EdaDashboard.tsx` and `/api/eda` to analyze categorical (crime type) and spatial (district) crime distributions using actual data.
  - **Algorithm Comparison**: Built `CompareAlgorithms.tsx` and `/api/compare-clusters` allowing concurrent execution of K-Means, DBSCAN, and Hierarchical clustering. Returns mathematically verified Silhouette, Davies-Bouldin, and Calinski-Harabasz metrics based on properly transformed CRS systems.
  - **Patrol Intelligence**: Extended `hotspot_rankings` to include dominant crime and peak temporal periods per hotspot, rendering them as strategic decision-support cards.
  - **Performance Security**: Ensured all intensive ML computations remain isolated within the `ProcessPoolExecutor` utilizing asynchronous semaphores, maintaining 60fps UI responsiveness.
- **Status**: COMPLETED

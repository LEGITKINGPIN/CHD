# Paper to Feature Mapping

## Spatial Clustering (DBSCAN)
- **Literature basis**: paper_06.pdf (baqir2020), paper_18.pdf
- **Methodology**: Density-based spatial clustering
- **SpatialIntell implementation**: `sklearn.cluster.DBSCAN` with `metric='haversine'`
- **Adaptation/difference**: Implemented in Python via FastAPI, returning exact centroids dynamically instead of pre-computed static maps.
- **Experiment**: Pending Experiment
- **Result**: Pending Experiment
- **IEEE paper relevance**: Core methodology for hotspot detection.

## Metric Evaluation
- **Literature basis**: Engineering/product requirement; not directly derived from reviewed literature.

# Crime Hotspot Detection: Project Feature Comparison Matrix

This document provides a comprehensive technical comparison between the primary authoritative project (`Main Hotspot`) and the secondary reference implementation (`Kartik Parashar`). 

## Methodology
The comparison is based on a full repository audit of source code, datasets, APIs, UI, and observed architectural behavior. Features are strictly evaluated against the integration constraints to ensure that `Main Hotspot`'s superior architecture, performance, and research integrity are preserved.

## Feature Comparison Matrix

| Feature | Main Hotspot | Kartik Parashar | Better Implementation | Integration Decision | Reason |
|---------|--------------|-----------------|-----------------------|----------------------|--------|
| **Core Architecture** | React + FastAPI + SQLite | Streamlit | Main Hotspot | **KEEP** | Decoupled client-server architecture prevents UI blocking during heavy ML computations. |
| **Hotspot Detection** | Async API (`ml_engine.py`) | Sync on main thread | Main Hotspot | **KEEP** | Main Hotspot protects the event loop with semaphores and executors; Kartik Parashar recalculates on every UI render. |
| **K-Means** | UTM Projected Euclidean | Metric Projected | Main Hotspot | **KEEP** | Uses explicit EPSG:32616 (UTM) for geometrically correct centroid calculations. |
| **DBSCAN** | Haversine (Radians) | Haversine (Radians) | Main Hotspot | **KEEP** | Implementation mathematically identical, but Main Hotspot executes asynchronously. |
| **Hierarchical** | Ward linkage on UTM | Ward linkage on Metric | Main Hotspot | **KEEP** | Better CRS handling and execution isolation. |
| **Hotspot Ranking & Area** | Not Explicitly Ranked | Convex Hull Area & Density | Kartik Parashar | **PORT** | The Convex Hull area calculation and Intensity Score formula provide defensible spatial insights. |
| **Risk Prediction (ML)** | Synthetic derived target | Spatial Grid-based target | Kartik Parashar | **IMPROVE** | Kartik Parashar aggregates data into 1km² grids to predict risk (High/Medium/Low), which is methodologically stronger than purely synthetic target generation. Will reimplement asynchronously. |
| **Temporal Analysis / EDA** | `/api/trends` API | Plotly EDA charts | Kartik Parashar | **PORT** | Kartik Parashar has better visual temporal EDA (day of week histograms, district charts). We will port the charting concepts to React. |
| **Map Visualization** | MapLibre (WebGL) | Folium (HTML DOM) | Main Hotspot | **KEEP** | MapLibre provides GPU-accelerated rendering capable of handling tens of thousands of points smoothly. |
| **Data Ingestion (CSV)** | Hardcoded Registry | Upload Custom CSV | Kartik Parashar | **PORT** | Allowing users to upload and parse custom CSV files increases utility. Will be adapted to FastAPI/SQLite. |
| **Live API Feed** | Not Implemented | Socrata API Integration | Kartik Parashar | **PORT** | Connecting to live REST endpoints is highly valuable for real-time demonstration. |
| **Filtering** | API query decoupling | Streamlit multi-select | Main Hotspot | **KEEP** | Filtering in React sends an API request rather than freezing the entire application state. |
| **UI/UX Paradigm** | Map-First Workspace | Tabbed Dashboard | Main Hotspot | **KEEP** | Map-first interface provides better spatial context and analytical clarity. |
| **Evaluation Metrics** | Silhouette, DB, CH | Silhouette, DB, CH | Main Hotspot | **KEEP** | Metrics are identical, but Main Hotspot tracks them persistently in SQLite for research provenance. |
| **Research Provenance** | SQLite Experiments Table | Ephemeral | Main Hotspot | **KEEP** | Essential for the IEEE research paper reproducibility. |

## Detailed Feature Extraction Plan

### 1. Data Ingestion (Port & Improve)
- **Problem**: Main Hotspot currently relies entirely on a hardcoded `DATASET_REGISTRY` reading static files.
- **Porting**: We will introduce a `/api/upload` (for CSV) and `/api/fetch-live` (for Socrata API) endpoint in FastAPI.
- **Improvement**: Instead of reloading the dataframe entirely in memory on every request, uploaded datasets will be normalized and registered in the `DATASET_REGISTRY` dynamically or stored in SQLite.

### 2. Hotspot Ranking & Density Metrics (Port)
- **Problem**: Main Hotspot returns clusters but lacks a quantitative ranking based on area and density.
- **Porting**: Integrate the Convex Hull area calculation (from `hotspot_engine.py`) into `ml_engine.py`. Calculate the `Crime_Density_Per_KM2` and return an ordered list of ranked hotspots to the frontend.

### 3. Grid-Based Risk Prediction (Improve)
- **Problem**: Main Hotspot's `risk_model.py` uses a purely synthetic, mathematically deterministic target derived from existing features, which compromises research integrity if presented as a real prediction model.
- **Porting**: Adopt the 1km² spatial grid aggregation method from Kartik Parashar to predict relative risk levels based on historical volume and ratios.
- **Improvement**: Re-implement to execute via FastAPI's `ThreadPoolExecutor`/`ProcessPoolExecutor` to ensure it doesn't block the backend.

### 4. Advanced Temporal EDA (Port)
- **Problem**: Main Hotspot's frontend lacks deep temporal distribution charts compared to Kartik Parashar.
- **Porting**: Port the day-of-week, hourly, and district-level aggregations to Recharts components in the React frontend.

## Rejected Features
- **Folium Maps**: Rejected in favor of MapLibre. Folium generates heavy HTML files which degrade performance on large datasets.
- **Synchronous App Renders**: Streamlit's top-to-bottom re-execution is rejected.
- **Missing Coordinate Imputation via Nominatim**: Rejected as a synchronous blocking process. We will continue to drop rows with missing coordinates to maintain deterministic spatial accuracy unless the user explicitly requests geocoding.

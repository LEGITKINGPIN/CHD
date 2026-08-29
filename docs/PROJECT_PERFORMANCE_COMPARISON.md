# Crime Hotspot Detection: Performance Comparison

This document analyzes the performance characteristics of both projects to fulfill the non-regression constraint: *Because the secondary project is known to be slower, treat performance as a non-regression requirement.*

## Performance Bottlenecks in Kartik Parashar (Secondary Project)

The secondary project runs on Streamlit, which inherently limits performance for data-heavy ML applications. 

### 1. Synchronous Execution & Reactivity Re-Renders
- **Behavior**: In `app.py`, `load_and_pipeline_data(target_path)` executes synchronously. Every time a user changes a filter (e.g., selects a new district), Streamlit re-runs the entire script from top to bottom.
- **Impact**: This causes the backend to re-load datasets from disk, re-engineer features, and synchronously execute K-Means, DBSCAN, Hierarchical Clustering, and Random Forest training back-to-back before returning HTML to the user. This creates severe UI freezes and excessive CPU utilization.

### 2. Rendering Heavy Maps (Folium vs WebGL)
- **Behavior**: `Kartik Parashar` uses Folium to generate HTML DOM nodes for every crime point and hotspot circle. 
- **Impact**: Displaying 5,000+ points creates immense DOM trees that severely degrade browser memory and frame rates.
- **Main Hotspot Advantage**: Main Hotspot uses WebGL (MapLibre) which pushes rendering to the GPU, easily handling tens of thousands of data points with 60 FPS panning.

### 3. ML Processing
- **Behavior**: Models in the secondary project are trained on the main thread.
- **Impact**: When processing larger cities (e.g., Chicago with 5,000 points), the UI becomes completely unresponsive during the ~2-5 seconds it takes to compute DBSCAN and Hierarchical linkages.

## Main Hotspot Performance Architecture (To Be Preserved)

Main Hotspot avoids these bottlenecks through its superior decoupled architecture:

### 1. Asynchronous Decoupling
- **Architecture**: The FastAPI backend serves data instantly. React triggers state changes locally and only calls the ML endpoints (`/api/clusters`) when explicitly requested.
- **Benefit**: Zero UI freezing. The frontend map remains fully interactive while the server computes clusters.

### 2. ThreadPoolExecutor / ProcessPoolExecutor Isolation
- **Architecture**: In `ml_engine.py`, heavy computations (K-Means, DBSCAN) are isolated from the FastAPI event loop using a `ThreadPoolExecutor` (or `ProcessPoolExecutor`).
- **Benefit**: The server can continue serving `/api/trends` and `/api/health` to other clients simultaneously without blocking.

### 3. Concurrency Protection
- **Architecture**: `main.py` uses `asyncio.Semaphore(4)` to prevent the server from accepting too many parallel ML requests, avoiding CPU exhaustion (thread thrashing).

## Integration Non-Regression Guidelines

When porting features from `Kartik Parashar`, the following rules apply:

1. **Custom Uploads**: Processing an uploaded CSV or API feed must be done asynchronously. We will load the file into the normalized registry and return success, avoiding synchronous ML clustering during upload.
2. **Grid Prediction**: The 1km² risk prediction model from `prediction.py` will be moved into `backend/risk_model.py` and wrapped in the `ml_executor` to ensure it never blocks the FastAPI event loop.
3. **Convex Hull Area**: Calculating Convex Hull area for hotspots (`hotspot_engine.py`) is $O(n \log n)$ and will add minor computational overhead. This calculation must be strictly appended to the existing `ml_engine.py` pipeline inside the executor.
4. **Data Delivery**: Do not send large processed dataframes via JSON directly to the frontend for charting. We will calculate aggregation metrics (e.g., grouped by Day, District) in Python and only send the small aggregated JSON payload to the React charting libraries.

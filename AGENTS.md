# AGENTS.md — Crime Hotspot Detection & Predictive Analytics Platform

> **Project Codename**: CHD (Crime Hotspot Detection)
> **Domain**: Geospatial Crime Intelligence, Predictive Policing & Law Enforcement Decision Support
> **Stack**: Next.js 15 + React 19 + TypeScript (Frontend) · FastAPI + scikit-learn + Pandas (Backend)

---

## 1. Project Overview

This is a full-stack **Spatial Crime Intelligence & Predictive Hotspot Analytics Platform** designed for law enforcement command staff, crime analysts, and urban safety researchers. It provides:

- Interactive WebGL geospatial mapping with crime density visualization
- Unsupervised ML clustering (K-Means, DBSCAN, Hierarchical) for hotspot detection
- Supervised Random Forest risk classification over 1km² spatial grid cells
- Real-time CAD (Computer-Aided Dispatch) live feed simulation
- Executive briefing and command dossier generation (print/PDF-ready)
- 24-hour diurnal time-lapse heatmap animation
- Multi-city dataset support (Chicago, Delhi, Mumbai, Bengaluru, London, All-India)

---

## 2. Directory Structure

```
CHD/
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # All REST API endpoints (~809 lines)
│   ├── ml_engine.py            # Clustering algorithms (K-Means, DBSCAN, Hierarchical)
│   ├── risk_model.py           # Random Forest risk prediction pipeline
│   ├── normalizer.py           # Multi-format CSV normalizer & coordinate sniffing
│   ├── registry.py             # Dataset registry (city configs, paths, capabilities)
│   ├── schemas.py              # Pydantic response schemas
│   ├── models.py               # SQLAlchemy ORM models
│   ├── database.py             # SQLite database connection
│   ├── data_generator.py       # Synthetic crime data generator
│   ├── ncrb_dataset_generator.py  # Indian NCRB-based dataset generator
│   ├── requirements.txt        # Python dependencies (pinned)
│   └── tests/                  # Backend test suite
│
├── src/                        # React/TypeScript frontend source
│   ├── App.tsx                 # Root application — state management hub (~547 lines)
│   ├── main.tsx                # React DOM entry point
│   ├── types.ts                # All TypeScript interfaces & types
│   ├── index.css               # Global styles, CSS variables, dark/light theme tokens
│   ├── components/
│   │   ├── MapWorkspace.tsx     # Primary geospatial map canvas (MapLibre GL, ~1939 lines)
│   │   ├── Sidebar.tsx         # Left sidebar — dataset picker, filters, clustering controls
│   │   ├── Header.tsx          # Top navigation bar — view tabs, theme toggle, briefing button
│   │   ├── MetricsPanel.tsx    # Sidebar statistics panel
│   │   ├── MultiSelectDropdown.tsx  # Reusable multi-select filter component
│   │   ├── CompareAlgorithms.tsx    # Head-to-head algorithm benchmarking view
│   │   ├── PatrolIntelligence.tsx   # Tactical patrol route optimization view
│   │   ├── RiskDashboard.tsx        # Supervised ML risk prediction dashboard
│   │   ├── MacroDashboard.tsx       # Macro-level crime trend analytics
│   │   ├── EdaDashboard.tsx         # Exploratory Data Analysis dashboard
│   │   ├── LiveDispatchDrawer.tsx   # Slide-out real-time CAD dispatch panel
│   │   ├── LiveAlertToast.tsx       # Audio-visual critical incident popup toast
│   │   └── ExecutiveBriefingModal.tsx  # Print-ready executive dossier modal
│   ├── app/                    # Next.js app directory (layouts, pages)
│   └── server/                 # Server-side utilities
│
├── data/
│   ├── raw/                    # Raw CSV datasets (Chicago, Delhi, Mumbai, etc.)
│   └── processed/              # Cleaned/processed datasets
│
├── venv/                       # Python virtual environment
├── package.json                # Node.js dependencies
├── next.config.mjs             # Next.js configuration (API proxy to :8000)
├── vite.config.ts              # Vite build config
├── tsconfig.json               # TypeScript compiler config
├── vercel.json                 # Vercel deployment config
└── PRD.md                      # Product Requirements Document
```

---

## 3. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│                                                      │
│  App.tsx (State Hub)                                 │
│    ├── Header.tsx ─────── View Navigation Tabs       │
│    ├── Sidebar.tsx ────── Filters / Dataset Select   │
│    ├── MapWorkspace.tsx ─ MapLibre GL WebGL Canvas    │
│    ├── CompareAlgorithms  Algorithm Benchmarking      │
│    ├── PatrolIntelligence  Patrol Route Optimizer     │
│    ├── RiskDashboard ──── ML Risk Predictor           │
│    ├── MacroDashboard ─── Macro Trend Charts          │
│    ├── EdaDashboard ───── EDA Visualizations          │
│    ├── LiveDispatchDrawer  Real-Time Dispatch Feed    │
│    ├── LiveAlertToast ─── Critical Alert Popup        │
│    └── ExecutiveBriefingModal  PDF Dossier Generator  │
│                                                      │
└──────────────────── HTTP REST ───────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (:8000)                  │
│                                                      │
│  main.py                                             │
│    ├── GET  /api/datasets          List cities        │
│    ├── GET  /api/crimes            Fetch incidents    │
│    ├── GET  /api/metadata          Bounding box/dates │
│    ├── POST /api/upload            Custom CSV ingest  │
│    ├── POST /api/live/ingest       Socrata live pull  │
│    ├── POST /api/cluster           Run single algo    │
│    ├── POST /api/compare-clusters  Benchmark 3 algos  │
│    ├── POST /api/predictions       Risk model train   │
│    ├── GET  /api/live/stream       CAD dispatch feed  │
│    └── POST /api/patrol-route      Route optimization │
│                                                      │
│  ml_engine.py ──── K-Means / DBSCAN / Hierarchical   │
│  risk_model.py ─── Random Forest Grid Classifier      │
│  normalizer.py ─── CSV auto-detection & normalization │
│  registry.py ───── Dataset configurations             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 4. Frontend Components Reference

### 4.1 `App.tsx` — Application State Hub
- **Role**: Central orchestrator. Holds ALL shared application state and passes props down to child views.
- **Key State**:
  - `activeView`: Controls which panel is visible (`'map'`, `'compare'`, `'patrol'`, `'risk'`, `'macro'`, `'eda'`)
  - `crimes` / `filteredCrimes`: Raw and filtered crime record arrays
  - `selectedDatasetKeys`: Active dataset keys
  - `selectedTypes`, `selectedDistricts`, `selectedArrest`: Active filter selections
  - `clusteringResult`: Output from ML clustering algorithms
  - `activeRiskGrid`: Deployed 1km² risk grid polygons
  - `activePatrolRoute`: Deployed tactical patrol route
  - `liveIncidents`: Real-time dispatch incidents
  - `cachedRiskPrediction`: Cached RF model results for instant tab switching
  - `theme`: `'light'` or `'dark'` mode

### 4.2 `MapWorkspace.tsx` — Geospatial Canvas (~1939 lines)
- **Largest component**. Renders the interactive MapLibre GL map.
- **Layers**: Crime scatter points, clustered circles, cluster hulls, heatmap, risk grid polygons, patrol route line, live incident radar markers, custom radius circle.
- **Key interactions**: Interactive hover popups (throttled to avoid re-render storms), cluster expansion on click, time-lapse player integration, layer toggle toolbar.
- **Performance note**: Hover on `risk-grid-fill` layer checks `grid_id` to prevent pixel-level re-renders.

### 4.3 `RiskDashboard.tsx` — Supervised Risk Model View
- Calls `POST /api/predictions` with dataset key, n_estimators, and test_size.
- Displays: Accuracy/Precision/Recall/F1/ROC-AUC metrics, confusion matrix, Gini feature importance chart, filterable sector table.
- "Deploy to Map" sends `grid_cells` to MapWorkspace for overlay.

### 4.4 `CompareAlgorithms.tsx` — Algorithm Benchmarking
- Calls `POST /api/compare-clusters` to run K-Means, DBSCAN, and Hierarchical concurrently.
- Displays: execution time, silhouette score, cluster count, outlier count per algorithm.
- Auto-runs on filter or dataset changes.

### 4.5 `PatrolIntelligence.tsx` — Tactical Patrol Optimization
- Takes `clusteringResult` centroids and generates optimized patrol waypoints.
- Builds patrol routes with distance estimation and per-checkpoint tactical recommendations.
- "Deploy Route" sends the route as a GeoJSON line to MapWorkspace.

### 4.6 `LiveDispatchDrawer.tsx` — Real-Time Feed
- Polls `GET /api/live/stream` on a configurable interval (5s–60s).
- Displays active incidents with severity badges, assigned units, and elapsed time.
- "Locate" action flies the map camera to incident coordinates.

### 4.7 `LiveAlertToast.tsx` — Critical Alert Popup
- Pops up when `activeLiveAlert` is set (triggered by new critical/violent incident).
- Features Web Audio API chime, 7-second auto-dismiss with shrink progress bar.
- Uses `@keyframes shrink` CSS animation.

### 4.8 `ExecutiveBriefingModal.tsx` — PDF Dossier
- Full-screen modal generating a structured police intelligence briefing.
- Includes: department header, incident stats, cluster analysis, risk breakdown, recent dispatches, and operational directives.
- `@media print` CSS hides UI chrome and formats for A4 output.

---

## 5. Backend API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/datasets` | List all registered city datasets with capabilities |
| `GET` | `/api/crimes?dataset=chicago` | Fetch all crime records for a dataset |
| `GET` | `/api/metadata?dataset=chicago` | Get bounding box, date range, total count |
| `POST` | `/api/upload` | Upload custom CSV (auto-normalized) |
| `POST` | `/api/live/ingest` | Pull live data from Socrata Open Data API |
| `POST` | `/api/cluster` | Run a single clustering algorithm |
| `POST` | `/api/compare-clusters` | Benchmark K-Means vs DBSCAN vs Hierarchical |
| `POST` | `/api/predictions` | Train Random Forest risk model and return grid cells |
| `GET` | `/api/live/stream?dataset=...&count=12` | Get simulated real-time dispatch incidents |
| `POST` | `/api/patrol-route` | Generate optimized patrol route from cluster centroids |

---

## 6. Machine Learning Models

### 6.1 Unsupervised Clustering (`ml_engine.py`)
- **K-Means**: Partitions incidents into `k` Voronoi cells. Configurable `k` parameter.
- **DBSCAN**: Density-based clustering. Configurable `eps` (radius) and `minPts` (min neighbors).
- **Hierarchical (Agglomerative)**: Ward-linkage bottom-up dendrogram clustering.
- **Metrics**: Silhouette Score, Davies-Bouldin Index, Calinski-Harabasz Index.

### 6.2 Supervised Risk Prediction (`risk_model.py`)
- **Algorithm**: `RandomForestClassifier` (scikit-learn)
- **Grid**: Metropolitan area tiled into ~1km² cells (0.01° grid)
- **Features**: `total_crimes`, `violent_ratio`, `night_ratio`, `weekend_ratio`, `grid_lat`, `grid_lng`
- **Target**: 3-class risk label (`High Risk`, `Medium Risk`, `Low Risk`) based on crime density quantiles
- **Evaluation**: Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix
- **Explainability**: Gini feature importance ranking

---

## 7. Registered Datasets

| Key | City | Source |
|-----|------|--------|
| `chicago` | Chicago, USA | Chicago Police Open Data Portal |
| `delhi` | Delhi, India | NCRB-based synthetic sample |
| `mumbai` | Mumbai, India | NCRB-based synthetic sample |
| `bengaluru` | Bengaluru, India | NCRB-based synthetic sample |
| `india` | All India | Pan-India NCRB-based sample |
| `london` | London, UK | UK Police API sample |
| `cleaned` | Chicago (Legacy) | Pre-processed cleaned CSV |

Custom CSV datasets can be uploaded at runtime via the upload endpoint.

---

## 8. TypeScript Type System (`types.ts`)

Key interfaces:

| Interface | Purpose |
|-----------|---------|
| `CrimeRecord` | Single crime incident (lat, lng, type, date, hour, district, arrest) |
| `ClusteringResult` | Clustering output (labels, centroids, metrics, hotspot rankings) |
| `RiskGridCell` | Single 1km² grid cell with risk classification |
| `RiskPredictionResult` | Full RF model output (metrics, grid_cells, feature_importances) |
| `TacticalPatrolRoute` | Optimized patrol route with checkpoints |
| `LiveDispatchIncident` | Real-time CAD dispatch incident |
| `BriefingReportData` | Executive dossier data structure |
| `DatasetInfo` | Dataset metadata with capabilities |

---

## 9. Theming & Styling

- **Dual themes**: Light mode (default) and Dark mode, toggled via `html.dark` class.
- **CSS Variables**: All colors defined as CSS custom properties in `index.css` under `:root` and `.dark`.
- **Key tokens**:
  - `--color-navy`, `--color-navy-deep`: Primary text
  - `--color-background`, `--color-surface`, `--color-surface-soft`: Backgrounds
  - `--color-border`, `--color-border-strong`: Borders
  - `--color-primary`, `--color-indigo`: Brand accents
  - `--color-success/warning/danger/critical/rose/teal`: Semantic status colors
- **Font**: Inter (loaded via `@fontsource/inter`)
- **Animations**: CSS `@keyframes` for shrink bars, pulse radars, spin loaders.

---

## 10. Development Setup

### Prerequisites
- **Node.js** >= 18
- **Python** >= 3.11
- **pip** or **uv** for Python package management

### Frontend
```bash
cd CHD
npm install
npm run dev          # Starts Next.js dev server on :3000
```

### Backend
```bash
cd CHD
python -m venv venv
.\venv\Scripts\activate     # Windows
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --port 8000 --reload
```

### API Proxy
Next.js proxies `/api/*` requests to `http://127.0.0.1:8000` via `next.config.mjs` rewrites.

---

## 11. Key Dependencies

### Frontend
| Package | Purpose |
|---------|---------|
| `next` (15.x) | React framework, SSR, API proxy |
| `react` (19.x) | UI library |
| `maplibre-gl` + `react-map-gl` | WebGL vector map rendering |
| `recharts` | Data visualization charts |
| `@turf/turf` | Geospatial computations (convex hulls, distances) |
| `ml-kmeans`, `density-clustering`, `ml-hclust` | Client-side ML clustering fallbacks |
| `lucide-react` | Icon library |
| `tailwindcss` (4.x) | Utility-first CSS |
| `clsx` | Conditional class merging |
| `motion` | Animation library |

### Backend
| Package | Purpose |
|---------|---------|
| `fastapi` | REST API framework |
| `uvicorn` | ASGI server |
| `scikit-learn` | ML algorithms (RandomForest, clustering metrics) |
| `pandas` + `numpy` | Data manipulation |
| `geopandas` + `shapely` | Geospatial data processing |
| `SQLAlchemy` | ORM for SQLite |

---

## 12. Performance Conventions

- **Hover throttling**: All map hover handlers check if the underlying feature/entity has changed before calling `setState`. This prevents 60fps re-render storms when mousing over dense polygons.
- **Tab caching**: Expensive computations (e.g., RF model training) are cached in `App.tsx` state (`cachedRiskPrediction`) so switching tabs back is instant (0ms).
- **Filter memoization**: Array dependencies in `useEffect` are serialized to stable keys to prevent redundant API calls on parent re-renders.
- **GPU acceleration**: Animated elements use `will-change: transform` and `transform: translateZ(0)` for compositor-layer promotion.
- **Camera animations**: Map fly/ease durations are capped at 700-800ms for responsive tactical focusing.

---

## 13. Coding Conventions

- All React components are functional components with hooks.
- TypeScript strict mode — zero `any` types in production interfaces (only in event handlers where MapLibre types are untyped).
- CSS uses Tailwind utility classes inline with `var(--color-*)` CSS custom properties for theme support.
- Backend follows FastAPI conventions with Pydantic schemas for request/response validation.
- All ML model endpoints return structured JSON with `status`, `metrics`, and result arrays.
- File naming: PascalCase for React components, snake_case for Python modules.

---

## 14. Common Tasks

### Add a new dataset
1. Place CSV in `data/raw/`.
2. Add entry to `backend/registry.py` `DATASET_REGISTRY` dict with correct coordinate/temporal column names.
3. The normalizer (`normalizer.py`) auto-detects coordinate formats and maps columns to the standard `CrimeRecord` schema.

### Add a new map layer
1. Define the GeoJSON source and layer specification in `MapWorkspace.tsx`.
2. Add toggle state and button in the toolbar section.
3. Add hover handler in `onInteractiveHover` with appropriate re-render guard.

### Add a new dashboard tab
1. Create a new component in `src/components/`.
2. Add the view name to the `activeView` type in `App.tsx`.
3. Add navigation button in `Header.tsx`.
4. Add the conditional render in the main return of `App.tsx`.

### Run type checking
```bash
node .\node_modules\typescript\bin\tsc --noEmit
```

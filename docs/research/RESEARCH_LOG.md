# Research Log

## Initialization Phase
- **Date**: 2026-08-26
- **Action**: Synthetic dataset initialized with seasonal, hourly, and weekly rejection sampling rules.
- **Status**: COMPLETED

## ML Pipeline Implementation
- **Date**: 2026-08-26
- **Action**: Random Forest model implementation with Chronological train/test split.
- **Status**: COMPLETED

## Integration Phase (Kartik Parashar to Main Hotspot)
- **Date**: 2026-08-29
- **Source Project**: Kartik Parashar
- **Feature**: Hotspot Ranking via Convex Hull Area and Intensity Score
- **Previous State**: Returned raw cluster labels and centroids without density-based spatial ranking.
- **Imported Capability**: Quantitative density score per spatial cluster (Crimes per KM²).
- **Technical Modification**: Added Convex Hull area calculation in `ml_engine.py` using `scipy.spatial.ConvexHull`, executed asynchronously within the ThreadPoolExecutor.
- **Research Paper Section Affected**: Methodology, Model Comparison.

- **Date**: 2026-08-29
- **Feature**: Grid-Based Spatial Risk Prediction
- **Previous State**: `risk_model.py` synthesized a purely deterministic target (tautological model).
- **Imported Capability**: 1km² grid aggregation for relative historical risk prediction via Random Forest.
- **Technical Modification**: Modified `risk_model.py` to aggregate records by spatial grid cell (0.01° resolution) before training.
- **Research Paper Section Affected**: Methodology.

## Final Project Alignment Phase
- **Date**: 2026-08-29
- **Action**: Comprehensive audit and feature implementation aligned with academic problem statement.
- **Key Implementations**:
  - **EDA Dashboard**: `EdaDashboard.tsx` + `/api/eda` — categorical and spatial crime distribution analysis.
  - **Algorithm Comparison**: `CompareAlgorithms.tsx` + `/api/compare-clusters` — concurrent K-Means, DBSCAN, Hierarchical with verified Silhouette, Davies-Bouldin, Calinski-Harabasz metrics.
  - **Patrol Intelligence**: Hotspot cards with dominant crime type, peak temporal period, and coordinates.
  - **Performance Security**: All ML computations isolated in `ThreadPoolExecutor` with semaphore concurrency control.
- **Status**: COMPLETED

## UI Modernization Phase
- **Date**: 2026-08-29
- **Action**: Professional GIS/spatial-intelligence UI refinement.
- **Key Changes**:
  - Sidebar converted to overlay (absolute positioning over map).
  - Map style switcher relocated to bottom-left as floating icon.
  - CHD text-based logo replacing icon logo.
  - Search bar and layer button dynamically offset from sidebar via CSS variable `--sidebar-offset`.
  - Invisible scrollbars in sidebar.
  - Local area analysis panel with DBSCAN/K-Means/Hierarchical clustering within user-defined radius.
- **Status**: COMPLETED

## Infrastructure Migration: Vite → Next.js App Router
- **Date**: 2026-08-29
- **Action**: Migrated frontend from Vite + custom Express proxy to Next.js 15 App Router.
- **Key Changes**:
  - `src/app/layout.tsx` — root HTML layout replacing `index.html`.
  - `src/app/page.tsx` — single Next.js route wrapping existing `App.tsx` ("use client").
  - `next.config.mjs` — API proxy rewrites: `/api/*` → `${FASTAPI_URL}/api/*` (env-var driven).
  - `postcss.config.mjs` — Tailwind v4 PostCSS integration replacing `@tailwindcss/vite`.
  - `MapWorkspace` dynamically imported with `{ ssr: false }` to prevent MapLibre window errors during SSR.
  - `VITE_API_URL` → `NEXT_PUBLIC_API_URL` (or relative `/api` with proxy).
  - Legacy files (`vite.config.ts`, `server.ts`, `src/main.tsx`) preserved (not deleted).
  - `.next/` added to `.gitignore`.
- **Build Result**: `✓ Compiled successfully` — Exit code 0.
- **Server**: HTTP 200 on `localhost:3000`.
- **Research Paper Section Affected**: System Architecture, Experimental Setup.
- **Status**: COMPLETED

## Deployment Configuration
- **Date**: 2026-08-29
- **Vercel**: Frontend auto-deploys from `main` branch.
- **Render**: Backend auto-deploys from `main` branch.
- **CORS**: Fully open (`allow_origins=["*"]`) to support direct Vercel→Render API calls.
- **Required Env Var**: `FASTAPI_URL=https://chd-548a.onrender.com` must be set in Vercel dashboard.
- **Branch Strategy**: `v0.9` is release branch; `main` is integration target for Vercel/Render auto-deploy.

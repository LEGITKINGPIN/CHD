# Crime Intelligence & Hotspot Detection Platform

This is an interactive geospatial analytics application designed to analyze historical crime records, identify spatial and temporal crime patterns, detect crime hotspots using clustering algorithms, evaluate clustering quality, classify risk levels, and present the results through an intuitive map-first interface.

## Prerequisites
- Node.js
- Python 3.9+
- pip (Python package manager)

## Run Locally

### 1. Setup Backend
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1   # On Windows
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### 2. Setup Frontend
```bash
npm install
npm run dev
```

## Dataset Registry
The platform supports multiple datasets through a unified `Dataset Registry` (e.g., Chicago, Bengaluru, Delhi, Mumbai). Geographic extent, crime types, dates, times, and counts are factual parameters retrieved directly from the respective source CSVs. Missing coordinates are dropped to preserve map integrity. Temporary temporal derivations are performed as an engineering convenience. Every ML execution is isolated to a specific dataset to ensure strict experimental provenance.

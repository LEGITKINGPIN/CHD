# Product Requirements Document (PRD)

## Crime Intelligence & Hotspot Detection Platform

**Project Type:** B.Tech Data Science / College Live Project  
**Product Category:** Geospatial Crime Analytics, Machine Learning & Decision Support  
**Primary Users:** Students/researchers, analysts, law-enforcement-oriented users, administrators  
**Primary Objective:** Build a fast, interactive, production-quality crime intelligence platform that uses historical crime data, machine learning, clustering, geospatial analysis, and temporal analysis to identify and visualize crime hotspots and risk patterns.

---

# 1. Executive Summary

The Crime Intelligence & Hotspot Detection Platform is an interactive geospatial analytics application designed to analyze historical crime records, identify spatial and temporal crime patterns, detect crime hotspots using clustering algorithms, evaluate clustering quality, classify risk levels, and present the results through an intuitive map-first interface.

The existing project establishes the academic foundation around:

- Crime-data collection and preprocessing
- Exploratory data analysis
- Crime hotspot detection
- K-Means clustering
- DBSCAN clustering
- Hierarchical clustering
- Clustering evaluation
- Crime trend analysis
- Interactive geographic visualization
- Crime-risk prediction
- Decision-support dashboards

The new product should transform that foundation into a substantially more polished application rather than simply reproducing the existing Streamlit dashboard.

The application should feel like a professional GIS/data-intelligence product, with the interactive map serving as the primary analytical workspace.

---

# 2. Product Vision

Build a modern crime-intelligence platform where users can answer questions such as:

- Where are crimes concentrated?
- Which areas represent significant hotspots?
- What types of crime dominate an area?
- How does crime vary by time, day, month, or year?
- Which clustering algorithm identifies the most meaningful spatial patterns?
- What areas have higher calculated risk?
- How do hotspots change over time?
- What evidence supports a hotspot classification?
- How can analysts compare different models and datasets?

The product should convert raw crime records into understandable spatial intelligence.

---

# 3. Product Goals

## 3.1 Primary Goals

1. Detect geographically concentrated crime hotspots.
2. Compare multiple clustering algorithms.
3. Evaluate clustering quality using established metrics.
4. Analyze crime patterns across time.
5. Provide crime-risk classification/prediction.
6. Visualize results on a high-performance interactive map.
7. Allow users to filter and explore crime data interactively.
8. Make ML results understandable to non-technical users.
9. Provide an efficient and responsive user experience.
10. Maintain a technically defensible architecture suitable for a college project demonstration and evaluation.

## 3.2 Secondary Goals

- Support multiple cities/datasets.
- Provide reusable data-processing pipelines.
- Enable future integration with real-world crime datasets.
- Support future real-time crime monitoring.
- Make the platform extensible for additional ML models and GIS layers.

---

# 4. Non-Goals

The initial release will NOT attempt to:

- Replace professional law-enforcement systems.
- Make autonomous policing decisions.
- Automatically dispatch police resources.
- Identify individual suspects.
- Perform facial recognition.
- Predict that a specific individual will commit a crime.
- Provide guaranteed future crime predictions.
- Integrate CCTV systems unless separately approved.
- Provide navigation or consumer map features unrelated to crime analysis.

Predictions and risk classifications must be presented as analytical outputs, not certainties.

---

# 5. Academic Requirements

The product must preserve the core academic requirements established by the project materials.

## 5.1 Data Processing

The system must support:

- Data loading
- Data validation
- Missing-value handling
- Duplicate removal
- Coordinate validation
- Date/time parsing
- Feature generation
- Data normalization where required
- Dataset summaries

## 5.2 Exploratory Data Analysis

The system should provide analysis for:

- Crime frequency
- Crime categories/types
- Geographic distribution
- Temporal distribution
- Hour-of-day distribution
- Day-of-week distribution
- Monthly/yearly trends
- District/area distribution
- Arrest status where available

## 5.3 Clustering

The initial academic clustering algorithms are:

### K-Means

Used for partitioning crimes into spatial clusters.

### DBSCAN

Used for density-based hotspot discovery and irregular spatial patterns.

### Hierarchical Clustering

Used for comparative cluster analysis.

The system must retain the ability to compare their results.

## 5.4 Evaluation Metrics

The platform should support:

- Silhouette Score
- Davies-Bouldin Index
- Calinski-Harabasz Index

The system should explain what each metric means and indicate whether higher or lower values are preferable.

---

# 6. Machine Learning & Analytical Requirements

## 6.1 Feature Engineering

The existing project defines temporal and spatial features including:

- Hour
- IsNight
- IsWeekend
- Day_Name
- Month
- Year
- Hour_sin
- Hour_cos
- Month_sin
- Month_cos
- DayOfWeek_sin
- DayOfWeek_cos
- Projected spatial coordinates
- Grid coordinates
- Grid ID

The implementation should preserve the conceptual purpose of these features while allowing the architecture to improve their implementation.

## 6.2 Spatial Features

The system must correctly distinguish between:

- Geographic latitude/longitude
- Projected metric coordinates
- Distance-based coordinates
- Density/grid representations

Coordinate transformations must be mathematically appropriate for the selected algorithm.

## 6.3 Risk Classification

The platform should calculate a meaningful crime-risk classification using spatial and/or temporal evidence.

Potential levels:

- Low
- Moderate
- High
- Critical

Risk classification must be explainable.

A user should be able to understand why an area received a particular risk level.

## 6.4 Prediction

The current project uses Random Forest for crime-risk prediction.

The final architecture should retain Random Forest if it performs appropriately, but the system should allow model comparison rather than treating Random Forest as permanently mandatory.

Potential candidate models may include:

- Random Forest
- Gradient Boosting
- XGBoost
- LightGBM

Additional models should only be introduced when they provide meaningful value.

The final model selection should be evidence-based.

---

# 7. Data Requirements

## 7.1 Initial Dataset Scope

The project materials identify:

- Chicago crime data
- Los Angeles crime data
- New York crime data

The existing implementation also contains support for Indian-city datasets.

The architecture should therefore be designed around a normalized internal schema that can accommodate multiple source datasets.

## 7.2 Core Fields

Expected analytical fields include:

- Crime ID
- Crime Type / Primary Type
- Date
- Time
- Latitude
- Longitude
- Location Description
- District
- Arrest Status

The system may support additional dataset-specific fields.

## 7.3 Dataset Normalization

Different datasets may use different identifiers and schemas.

The application should normalize source data into a common internal model without destroying source-specific information.

Example:

```text
Source Dataset
      ↓
Schema Detection
      ↓
Validation
      ↓
Normalization
      ↓
Feature Engineering
      ↓
Analytics / ML
```

---

# 8. Map-First User Experience

## 8.1 Design Direction

The primary interface should be inspired by the interaction model and visual hierarchy of modern mapping applications such as Google Maps.

This is a UX reference only.

The application must NOT reproduce Google's proprietary UI, branding, features, or content.

The map should occupy the majority of the viewport and act as the central analytical workspace.

## 8.2 Map Characteristics

The map should support:

- Smooth pan
- Smooth zoom
- Geographic navigation
- Marker rendering
- Cluster visualization
- Heatmaps
- Hotspot boundaries
- Risk overlays
- Polygon layers
- Dynamic filtering
- Tooltips
- Detail panels
- Layer toggling
- Map legends
- Selected-area highlighting

## 8.3 Crime-Specific Map Controls

Instead of consumer map categories, the interface should provide controls such as:

- Crime type
- Crime category
- Date range
- Time range
- Day of week
- City
- District
- Risk level
- Clustering algorithm
- Hotspot layer
- Crime density
- Prediction layer
- Cluster boundaries
- Historical/current analysis mode

## 8.4 Map Interaction

Selecting a hotspot should open a contextual information panel containing:

- Hotspot/risk name or identifier
- Geographic location
- Crime count
- Dominant crime types
- Risk level
- Cluster ID
- Cluster algorithm
- Density information
- Relevant time patterns
- Trend information
- Model/prediction information where applicable

---

# 9. Proposed Application Layout

The exact layout can evolve during UI design, but the application should follow a map-first structure.

```text
┌───────────────────────────────────────────────────────────────┐
│ Logo │ Search / Location │ Filters │ Analysis │ Profile      │
├───────┬───────────────────────────────────────────────┬───────┤
│       │                                               │       │
│       │                                               │       │
│ Side  │                                               │ Map   │
│ Tools │                 MAP WORKSPACE                 │       │
│       │                                               │       │
│       │                                               │       │
├───────┴───────────────────────────────────────────────┴───────┤
│ Selected Area / Analytics / Timeline / Insights               │
└───────────────────────────────────────────────────────────────┘
```

The final UI should avoid unnecessarily covering the map.

---

# 10. Dashboard & Analytics

The platform should provide analytical views without turning the entire application into a conventional dashboard.

Possible analytical modules:

### Overview

- Total crimes
- Active hotspots
- High-risk areas
- Dataset coverage
- Selected location summary

### Crime Trends

- Daily trends
- Weekly trends
- Monthly trends
- Yearly trends
- Hourly patterns

### Crime Distribution

- Crime-type distribution
- District distribution
- Arrest statistics
- Category distribution

### Hotspot Analysis

- Number of hotspots
- Hotspot density
- Hotspot size
- Dominant crimes
- Risk distribution

### Model Comparison

A comparison interface should display:

| Algorithm | Clusters | Silhouette | Davies-Bouldin | Calinski-Harabasz |
|---|---:|---:|---:|---:|
| K-Means | ... | ... | ... | ... |
| DBSCAN | ... | ... | ... | ... |
| Hierarchical | ... | ... | ... | ... |

The system should provide a clear interpretation rather than merely displaying numbers.

---

# 11. Search

The application should provide a fast search mechanism for:

- Cities
- Districts
- Areas
- Coordinates
- Known locations where supported

Search results should move or focus the map to the selected geographic area.

Search should not attempt to recreate Google Maps' complete search ecosystem.

---

# 12. Filtering Architecture

Filters should update relevant visualizations without unnecessarily recomputing the entire ML pipeline.

Filtering dimensions may include:

- City
- District
- Crime type
- Crime category
- Date range
- Time range
- Day of week
- Risk level
- Cluster algorithm
- Cluster ID

The application should clearly distinguish:

**Data filtering**

from

**Model recomputation**

so that changing a display filter does not trigger unnecessary expensive ML computation.

---

# 13. Performance Requirements

Performance is a core product requirement.

## 13.1 Frontend

The UI should:

- Render the map smoothly.
- Avoid rendering unnecessary DOM elements.
- Use GPU/WebGL rendering where appropriate.
- Load large spatial datasets progressively.
- Avoid sending the complete dataset to the browser.
- Use efficient spatial representations.
- Lazy-load secondary analytical content.

## 13.2 Backend

The backend should:

- Avoid recomputing expensive models unnecessarily.
- Cache reusable analytical results.
- Support asynchronous/background processing where appropriate.
- Return only required data.
- Use pagination or aggregation for large datasets.

## 13.3 ML Pipeline

Expensive operations should be:

- Cached
- Precomputed where appropriate
- Parameterized
- Reusable across sessions
- Separately executable from the UI

Hierarchical clustering should be handled carefully for large datasets because of its computational/memory complexity.

---

# 14. Recommended Technology Direction

The existing project is based around Python, Scikit-learn, Plotly, Folium and Streamlit. This is useful for the current implementation, but it should not automatically constrain the final product.

A better production-oriented architecture should be evaluated.

## Recommended frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- Accessible component library
- MapLibre GL JS or an equivalent high-performance WebGL mapping solution

## Recommended backend

- Python
- FastAPI
- Pydantic

## Recommended ML stack

- NumPy
- Pandas and/or Polars
- Scikit-learn
- SciPy
- Joblib
- Optional XGBoost/LightGBM after evaluation

## Recommended geospatial stack

- GeoPandas
- Shapely
- PyProj
- Spatial indexing
- Vector tiles or efficient GeoJSON where appropriate

## Recommended database

PostgreSQL + PostGIS if persistent geographic querying becomes necessary.

## Caching

Redis may be introduced if benchmarking demonstrates meaningful benefit.

Caching should not be added merely for architectural complexity.

## Deployment

The system should be containerizable and deployable using a practical cloud architecture.

The final technology selection should be based on:

- Performance
- Simplicity
- Cost
- Maintainability
- Developer productivity
- GIS capability
- ML compatibility
- Deployment requirements

---

# 15. Proposed High-Level Architecture

```text
                    ┌───────────────────┐
                    │   Web Frontend    │
                    │ React / Next.js   │
                    │ TypeScript        │
                    └─────────┬─────────┘
                              │
                         HTTPS / API
                              │
                    ┌─────────▼─────────┐
                    │   FastAPI Layer   │
                    │ REST / analytics  │
                    └─────────┬─────────┘
                              │
            ┌─────────────────┼──────────────────┐
            │                 │                  │
     ┌──────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
     │ PostgreSQL │    │ ML Pipeline │   │ Cache       │
     │ + PostGIS  │    │ Python      │   │ Optional    │
     └────────────┘    └─────────────┘   └─────────────┘
                              │
                     ┌────────▼────────┐
                     │ Models /        │
                     │ Feature Store   │
                     └─────────────────┘
```

This is a proposed direction, not a mandatory implementation. The final architecture should be validated against the actual repository and deployment constraints.

---

# 16. API Requirements

The backend should expose clean, documented APIs.

Potential endpoints:

```text
GET    /api/health
GET    /api/datasets
GET    /api/datasets/{id}/summary
GET    /api/crimes
GET    /api/crimes/aggregate
GET    /api/hotspots
GET    /api/hotspots/{id}
GET    /api/clusters
GET    /api/clusters/compare
GET    /api/trends
GET    /api/risk
POST   /api/predictions
GET    /api/metadata
```

The exact API contract should be finalized during implementation.

APIs should support filtering, pagination, aggregation and geographic bounding-box queries where appropriate.

---

# 17. Database Requirements

If a persistent database is used, geographic data should be stored using an appropriate spatial type.

The system should support efficient queries such as:

- Crimes within a geographic boundary
- Crimes within a radius
- Crimes in a district
- Hotspots within the current map viewport
- Crime counts by geographic grid
- Temporal aggregations
- Risk statistics

Indexes should be designed according to actual query patterns.

---

# 18. Security Requirements

The application should:

- Validate all incoming data.
- Validate API parameters.
- Sanitize user-provided inputs.
- Avoid exposing internal filesystem paths.
- Protect secrets through environment variables.
- Never commit API keys or credentials.
- Apply appropriate CORS policies.
- Rate-limit public endpoints if required.
- Avoid exposing sensitive raw datasets unnecessarily.

---

# 19. Privacy & Responsible Analytics

Crime analytics can create significant social and ethical risks.

The system should:

- Avoid identifying private individuals.
- Avoid individual-level criminal profiling.
- Clearly communicate that predictions are probabilistic.
- Avoid presenting model outputs as guaranteed future events.
- Provide model limitations.
- Clearly distinguish historical observations from predictions.
- Avoid unsupported claims about causality.

---

# 20. Accessibility

The interface should target WCAG-aligned accessibility practices.

Requirements include:

- Keyboard-accessible controls
- Visible focus states
- Semantic HTML
- Sufficient contrast
- Accessible labels
- Screen-reader-friendly controls
- Color-independent risk indicators
- Accessible tables for model results
- Alternative textual summaries for important charts

Map information should not rely solely on color.

---

# 21. Responsive Design

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop should provide the full map-first experience.

On mobile:

- Map remains the primary surface.
- Controls collapse into compact controls/drawers.
- Analytics appear as bottom sheets or expandable panels.
- Filters should not permanently obscure the map.
- Touch interactions must be optimized.
- Large analytical tables should become horizontally scrollable or transform into cards.

Responsive behavior should be intentionally designed rather than simply scaled down.

---

# 22. UI States

Every major component must account for:

### Loading

Show meaningful skeletons/spinners without blocking the entire application unnecessarily.

### Empty

Explain why no results are available and provide a useful action.

### Error

Display human-readable errors and recovery actions.

### Partial Data

Clearly indicate when a dataset lacks particular fields.

### No Model Result

Explain that prediction/clustering is unavailable rather than showing misleading empty output.

### Large Dataset

Use progressive loading/aggregation.

---

# 23. Visualization Requirements

Visualizations should prioritize analytical usefulness.

Required/expected visualizations may include:

- Crime density heatmap
- Hotspot polygons
- Cluster markers
- Cluster boundaries
- Crime-type distribution
- Temporal trend charts
- Hour/day heatmaps
- District comparisons
- Risk distribution
- Model evaluation comparison

Charts should be:

- Interactive where useful
- Responsive
- Consistent
- Accessible
- Properly labeled
- Free of unnecessary decoration

---

# 24. Hotspot Representation

A hotspot should not merely be a red dot.

Where sufficient data exists, the system should communicate:

- Geographic extent
- Crime density
- Crime volume
- Dominant crime types
- Time concentration
- Risk level
- Cluster membership
- Model confidence/quality information where applicable

The visual representation should distinguish:

**Observed crime density**

from

**ML-derived hotspot**

from

**Predicted risk**

These are different concepts and should not be visually conflated.

---

# 25. Model Explainability

For prediction/risk outputs, users should be able to inspect the major contributing features where technically appropriate.

Example:

```text
Risk Level: HIGH

Primary contributing factors:
• High recent crime density
• Elevated nighttime incidents
• High concentration of selected crime categories
• Historical hotspot persistence
```

The explanation must reflect actual model/data logic rather than fabricated reasoning.

---

# 26. Caching & Data Pipeline

The application should separate:

```text
Raw Data
   ↓
Validation
   ↓
Preprocessing
   ↓
Feature Engineering
   ↓
EDA
   ↓
Clustering
   ↓
Evaluation
   ↓
Hotspot Generation
   ↓
Prediction
   ↓
Persisted/Cacheable Results
   ↓
API
   ↓
Frontend
```

Changing a UI filter should not automatically execute the entire pipeline.

---

# 27. Existing Project Compatibility

The current project contains established data contracts such as:

- Latitude
- Longitude
- Date
- Primary Type
- Crime Category
- District
- Hour
- IsNight
- IsWeekend
- Day_Name
- Month
- Year

and engineered spatial/temporal fields.

Where existing modules or datasets are valuable, they should be reused or migrated rather than unnecessarily rewritten.

However:

> Existing architecture is not a constraint when a better production architecture is technically justified.

---

# 28. Testing Requirements

The final system should introduce automated testing.

## Unit Tests

Test:

- Data validation
- Feature engineering
- Coordinate transformation
- Clustering
- Evaluation metrics
- Risk classification
- API validation

## Integration Tests

Test:

- Data pipeline → model
- Model → API
- API → frontend
- Map filtering
- Dataset switching

## UI Tests

Test:

- Navigation
- Filtering
- Search
- Map interactions
- Responsive behavior
- Error states

## Performance Tests

Benchmark:

- Initial load
- Map rendering
- Dataset switching
- API response time
- Filtering
- Clustering
- Prediction

---

# 29. Observability

The production application should have structured logging.

Log:

- API errors
- Pipeline failures
- Model execution
- Dataset processing
- Slow operations
- Important application events

Do not log sensitive information unnecessarily.

---

# 30. Documentation

The final project should contain:

- README
- Architecture documentation
- Setup instructions
- Environment-variable documentation
- API documentation
- Dataset documentation
- ML methodology
- Model evaluation
- UI/UX documentation
- Deployment instructions
- Testing instructions
- Known limitations
- Future improvements

---

# 31. Deployment Requirements

The application should be deployable without requiring users to manually configure the development environment.

Deployment should support:

```text
Frontend
Backend
Database
ML artifacts
Environment configuration
```

The deployment strategy should favor simplicity and reliability over unnecessary infrastructure.

---

# 32. Development Principles

The implementation should follow these principles:

1. Production quality over prototype shortcuts.
2. Performance over unnecessary visual complexity.
3. Simplicity over unnecessary infrastructure.
4. Reusable components over duplicated code.
5. Data correctness over impressive-looking visualizations.
6. Explainable ML over black-box claims.
7. Responsive design from the beginning.
8. Accessibility from the beginning.
9. Test important analytical logic.
10. Never hard-code data when it can be modeled properly.
11. Never expose secrets.
12. Avoid unnecessary dependencies.
13. Avoid premature microservices.
14. Keep frontend and ML concerns cleanly separated.
15. Preserve academic requirements while improving implementation quality.

---

# 33. Acceptance Criteria

The product is considered successful when:

### Data

- Multiple supported datasets can be loaded.
- Data validation works.
- Cleaning and feature engineering produce consistent results.

### Machine Learning

- K-Means works.
- DBSCAN works.
- Hierarchical clustering works.
- Evaluation metrics are calculated.
- Algorithms can be compared.
- Risk/prediction functionality is available.
- Model results are reproducible.

### Map

- Map loads quickly.
- Users can pan and zoom smoothly.
- Hotspots are visually obvious.
- Clusters can be displayed.
- Layers can be toggled.
- Filters update the map.
- Selecting a hotspot reveals useful analytical information.

### Analytics

- Crime trends can be explored.
- Crime categories can be compared.
- Geographic distribution can be analyzed.
- Risk distribution can be examined.
- Model comparison is available.

### UX

- Interface is intuitive.
- Desktop experience is polished.
- Mobile experience is usable.
- Loading/error/empty states exist.
- Controls do not unnecessarily obstruct the map.

### Engineering

- Automated tests exist.
- APIs are documented.
- No secrets are committed.
- Application can be deployed reproducibly.
- Expensive computations are cached or appropriately precomputed.

---

# 34. Future Scope

The architecture should leave room for:

- Real-time crime feeds
- Live GIS updates
- Deep-learning forecasting
- Additional cities
- Mobile applications
- Police-oriented operational dashboards
- Patrol allocation optimization
- CCTV integration
- Streaming data
- Advanced forecasting
- Additional geospatial intelligence
- Automated analytical reports

These are future capabilities and should not unnecessarily complicate the initial release.

---

# 35. Definition of Done

A feature is not considered complete merely because it works in the developer environment.

It is complete when:

- Functional behavior works.
- UI is polished.
- Responsive behavior works.
- Loading/error/empty states exist.
- API validation exists where applicable.
- Tests exist for important logic.
- Performance has been considered.
- Documentation has been updated.
- No credentials/secrets are exposed.
- The implementation does not introduce unnecessary technical debt.

---

# 36. Final Product Principle

The final application should not be judged by how closely it follows the existing repository.

It should be judged by whether it successfully combines:

**Academic correctness**

+

**Machine-learning validity**

+

**Geospatial accuracy**

+

**High-performance engineering**

+

**Professional UI/UX**

+

**Explainable analytical results**

+

**Responsive design**

+

**Production-quality implementation**

The existing project files define the starting point and academic direction. The final architecture should be allowed to evolve when a demonstrably better technology or engineering approach is available.

The ultimate goal is to produce a **fast, modern, map-first Crime Intelligence & Hotspot Detection Platform**, rather than simply upgrading an existing Streamlit dashboard.

---

# 37. Dataset Registry & Scientific Constraints

This architecture integrates multiple datasets through a unified `Dataset Registry` (Chicago, Bengaluru, Delhi, Mumbai). 

## Facts vs. Engineering Decisions
- **Dataset Facts**: Geographic extent, crime types, dates, times, and counts are absolute facts retrieved directly from the respective source CSVs. The registry does not invent missing features. 
- **Engineering Decisions**: Missing coordinates are safely dropped to preserve map integrity. Temporary temporal derivation (e.g. `Hour` from `Date` if missing) is an engineering convenience, not a scientifically established feature of the raw data.
- **Scientific Contributions**: The inclusion of multiple cities is an **engineering capability** for demonstration. It should not be described as a scientific contribution (e.g., cross-city unified models) unless experimental evidence supports that claim. The model pipelines remain strictly isolated per dataset.

## Experimental Provenance
- Every ML execution isolates to a specific dataset. 
- Parameter units (e.g., DBSCAN epsilon) must be interpreted according to the CRS of the dataset. For WGS84, epsilon represents degrees; for projected systems (like Chicago EPSG:32616), epsilon represents meters.
- The `ClusteringExperiment` records the dataset key, filters, and CRS to ensure strict experimental provenance.
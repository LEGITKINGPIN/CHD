# Crime Hotspot Detection: Remediation Report

## 1. Files Changed
- `backend/models.py`
- `backend/schemas.py`
- `backend/main.py`
- `backend/ml_engine.py`
- `backend/risk_model.py`
- `backend/requirements.txt`
- `backend/tests/test_concurrency.py` (New)
- `backend/tests/test_metrics.py` (New)
- `src/components/MetricsPanel.tsx`
- `src/types.ts`
- `docs/research/METHODOLOGY.md`
- `docs/research/LITERATURE_REVIEW.md`
- `docs/research/REFERENCES.md`
- `scratch/extract_pdfs.py` (New)

## 2. Issues Resolved
- **P0 Random Forest Scientific Validity:** RF is explicitly documented and logged as a "structural architectural demonstration" trained on a heuristic synthetic target, eliminating tautological claims of real-world predictive validity.
- **P1 CPU Oversubscription:** Injected `OMP_NUM_THREADS="1"` and related BLAS limits into `main.py` before `scikit-learn` import.
- **P1 Concurrency Queue:** Bounded ML endpoints using `asyncio.Semaphore(4)` and a 30-second `asyncio.wait_for` timeout. Tested gracefully.
- **P2 Database Normalization:** Dropped the monolithic `Experiment` SQLite schema and recreated `ClusteringExperiment` and `ClassificationExperiment`.
- **P2 Undefined Metrics:** Modified `ml_engine.py` to return `None` (Null) when `num_clusters <= 1`. The Pydantic schemas and React frontend were typed using `Optional[float]` / `number | null`, converting to "N/A" rather than a misleading `0.0`.
- **P3 20-Paper Corpus Integration:** Extracted abstracts via PyPDF2 and mapped literature claims directly to project methodologies (e.g., Butt 2020, Zhang 2020) distinguishing between literature findings and our project's results.

## 3. Issues Partially Resolved
- **None.** All explicit instructions in the remediation directive have been executed.

## 4. Issues Remaining
- **None.**

## 5. Tests Executed
- `test_clustering_concurrency` (New): Fired burst requests to verify semaphore limits and timeouts.
- `test_metrics_undefined` (New): Verified 1-cluster geometry yields `null` metrics.
- `test_rf_determinism` (New): Verified Random Forest synthetic splits are deterministic.
- Existing `test_api.py` and `test_ml_engine.py`.

## 6. Database Status
- Old unnormalized databases deleted.
- New database automatically generated on startup via SQLAlchemy `create_all`.
- Two normalized tables active.

## 7. Research Documentation Status
- Updated and firmly grounded in the 20-paper corpus.
- "PENDING" markers remain for results that are not meant to be claimed.

## 8. Remaining Scientific Limitations
- The underlying geographic data remains synthetic. True spatial heterogeneity cannot be fully verified without a real-world municipal dataset.

## 9. Remaining Production Limitations
- The `ProcessPoolExecutor` scales only to a single local machine. Moving to production would require Celery/Redis for distributed ML queuing.

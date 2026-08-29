import asyncio
import logging
import os
import uuid
from concurrent.futures import ProcessPoolExecutor
import json
import urllib.request

from fastapi import Depends, FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Prevent Thread Thrashing / CPU Oversubscription
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"


from . import ml_engine, models, risk_model, schemas
from .database import engine, get_db
from .normalizer import DatasetLoader
from .registry import DATASET_REGISTRY

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crime Hotspot Detection API")

# Strict CORS using environment fallback
frontend_origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)

# Execution architecture for CPU-bound tasks
from concurrent.futures import ThreadPoolExecutor

ml_executor = ThreadPoolExecutor(max_workers=2)

# Bounded ML concurrency (prevents CPU exhaustion)
ml_semaphore = asyncio.Semaphore(4)


def get_or_create_dataset(
    db: Session, dataset_key: str, seed: int = 42, count: int = 2000
):
    dataset = (
        db.query(models.DatasetMeta)
        .filter(
            models.DatasetMeta.dataset_key == dataset_key,
            models.DatasetMeta.seed == seed,
        )
        .first()
    )

    if dataset:
        return dataset.id

    dataset_id = str(uuid.uuid4())
    new_dataset = models.DatasetMeta(
        id=dataset_id,
        dataset_key=dataset_key,
        version="v1",
        seed=seed,
        record_count=count,
        source_type="DATA_FOLDER_CSV",
    )
    db.add(new_dataset)
    db.commit()
    return dataset_id


@app.on_event("startup")
def startup_event():
    # Prefetch the default dataset on startup to ensure it's cached
    try:
        DatasetLoader.get_data("delhi")
    except Exception as e:
        logger.error(f"Failed to prefetch default dataset: {e}")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "SpatialIntell FastAPI"}


@app.get("/api/datasets", response_model=list[schemas.DatasetInfoSchema])
def list_datasets():
    return [
        schemas.DatasetInfoSchema(
            key=k, display_name=v.display_name, capabilities=v.capabilities.dict()
        )
        for k, v in DATASET_REGISTRY.items()
    ]


@app.get("/api/crimes")
def get_crimes(dataset: str = "delhi"):
    try:
        data, _ = DatasetLoader.get_data(dataset)
        return {"data": [record.dict() for record in data]}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/metadata", response_model=schemas.MetadataResponse)
def get_metadata(dataset: str = "delhi"):
    try:
        _, metadata = DatasetLoader.get_data(dataset)
        return metadata
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    os.makedirs("data/raw", exist_ok=True)
    file_path = f"data/raw/custom_upload_{uuid.uuid4().hex[:8]}.csv"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    dataset_key = f"custom_{uuid.uuid4().hex[:6]}"
    
    # Register dynamically
    from .registry import DATASET_REGISTRY, DatasetMeta, DatasetCapabilities
    DATASET_REGISTRY[dataset_key] = DatasetMeta(
        key=dataset_key,
        display_name=f"Uploaded: {file.filename}",
        path=file_path,
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        )
    )
    
    # Pre-warm the cache and normalize
    try:
        DatasetLoader.get_data(dataset_key)
    except Exception as e:
        # If it fails, remove from registry
        del DATASET_REGISTRY[dataset_key]
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded dataset: {str(e)}")
        
    return {"status": "success", "dataset_key": dataset_key, "message": "Dataset uploaded and processed successfully."}


@app.post("/api/fetch-live")
async def fetch_live_api(url: str = Form(...), limit: int = Form(2000)):
    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid API URL.")
        
    # Append limit for Socrata endpoints if not present
    if "socrata" in url.lower() or "limit" not in url.lower():
        separator = "&" if "?" in url else "?"
        url = f"{url}{separator}$limit={limit}"
        
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch from API: {str(e)}")
        
    if not isinstance(data, list):
        raise HTTPException(status_code=400, detail="Expected JSON array from API.")
        
    import pandas as pd
    df = pd.DataFrame(data)
    
    os.makedirs("data/raw", exist_ok=True)
    file_path = f"data/raw/live_api_{uuid.uuid4().hex[:8]}.csv"
    df.to_csv(file_path, index=False)
    
    dataset_key = f"live_{uuid.uuid4().hex[:6]}"
    
    # Register dynamically
    from .registry import DATASET_REGISTRY, DatasetMeta, DatasetCapabilities
    DATASET_REGISTRY[dataset_key] = DatasetMeta(
        key=dataset_key,
        display_name=f"Live Feed ({limit} records)",
        path=file_path,
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        )
    )
    
    try:
        DatasetLoader.get_data(dataset_key)
    except Exception as e:
        del DATASET_REGISTRY[dataset_key]
        raise HTTPException(status_code=400, detail=f"Failed to process live dataset. It may lack required coordinate columns. Error: {str(e)}")
        
    return {"status": "success", "dataset_key": dataset_key, "message": "Live dataset fetched and processed successfully."}


@app.post("/api/clusters", response_model=schemas.ClusteringResponse)
async def compute_clusters(
    request: schemas.ClusterParams, db: Session = Depends(get_db)
):
    try:
        data, metadata = DatasetLoader.get_data(request.dataset)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    dataset_keys = request.dataset.split(",")
    registry_meta = DATASET_REGISTRY[dataset_keys[0]]

    # Decoupled Filtering: Filter first, then cluster only the subset
    filtered_data = data
    if request.filter and "ALL" not in request.filter and len(request.filter) > 0:
        if not registry_meta.capabilities.supports_crime_type:
            raise HTTPException(
                status_code=400,
                detail=f"Dataset {request.dataset} does not support crime type filtering.",
            )
        filtered_data = [d for d in filtered_data if d.primary_type in request.filter]

    if (
        hasattr(request, "district")
        and request.district
        and "ALL" not in request.district
        and len(request.district) > 0
    ):
        if not registry_meta.capabilities.supports_district:
            raise HTTPException(
                status_code=400,
                detail=f"Dataset {request.dataset} does not support district filtering.",
            )
        filtered_data = [d for d in filtered_data if d.district in request.district]

    if request.arrest and "ALL" not in request.arrest and len(request.arrest) > 0:
        allowed_arrests = []
        if "Arrest Made" in request.arrest: allowed_arrests.append(True)
        if "Pending/No Arrest" in request.arrest: allowed_arrests.append(False)
        filtered_data = [d for d in filtered_data if getattr(d, "arrest", False) in allowed_arrests]

    if not filtered_data:
        raise HTTPException(
            status_code=400, detail="No records match the filter criteria."
        )

    # Extract coordinates [lat, lng]
    import numpy as np

    coords = np.array([[d.lat, d.lng] for d in filtered_data])

    try:
        # Bounded ML concurrency check
        async with ml_semaphore:
            # Offload to ProcessPoolExecutor
            loop = asyncio.get_event_loop()
            
            # Extract extra data for patrol intelligence
            extra_data = [d.dict() for d in filtered_data]
            
            labels, centroids, metrics, hotspot_rankings = await asyncio.wait_for(
                loop.run_in_executor(
                    ml_executor,
                    ml_engine.run_clustering,
                    coords,
                    request.algorithm,
                    request.params,
                    extra_data
                ),
                timeout=30.0,  # 30 second task timeout
            )
    except asyncio.TimeoutError:
        logger.error("Clustering timeout exceeded")
        raise HTTPException(status_code=504, detail="ML clustering task timed out.")
    except Exception:
        logger.exception("Clustering failed")
        raise HTTPException(
            status_code=500, detail="Internal ML Error during clustering."
        )

    dataset_id = get_or_create_dataset(
        db, dataset_key=request.dataset, count=metadata["totalCrimes"]
    )
    experiment_id = str(uuid.uuid4())
    metrics["experimentId"] = experiment_id

    # Save experiment
    exp = models.ClusteringExperiment(
        id=experiment_id,
        dataset_id=dataset_id,
        algorithm=request.algorithm,
        parameters=request.params,
        features={"features": ["lat", "lng"]},
        filters={
            "type": request.filter,
            "district": getattr(request, "district", ["ALL"]),
        },
        distance_metric="haversine"
        if request.algorithm in ["DBSCAN", "HIERARCHICAL"]
        else "euclidean_projected",
        crs=registry_meta.crs,
        coordinate_representation="Spherical [lat, lng]"
        if request.algorithm in ["DBSCAN", "HIERARCHICAL"]
        else "Projected [x, y]",
        num_clusters=metrics["numClusters"],
        num_noise=metrics["numNoise"],
        silhouette=metrics.get("silhouette"),
        davies_bouldin=metrics.get("daviesBouldin"),
        calinski_harabasz=metrics.get("calinskiHarabasz"),
        runtime_ms=metrics["runtimeMs"],
    )
    db.add(exp)
    db.commit()

    return {
        "labels": labels.tolist(),
        "centroids": centroids.tolist(),
        "metrics": metrics,
        "hotspot_rankings": hotspot_rankings,
    }


class EdaParams(BaseModel):
    dataset: str
    filter: list[str] = ["ALL"]
    district: list[str] = ["ALL"]
    arrest: list[str] = ["ALL"]

@app.post("/api/eda")
def get_eda(request: EdaParams):
    try:
        data, metadata = DatasetLoader.get_data(request.dataset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    dataset_keys = request.dataset.split(",")
    registry_meta = DATASET_REGISTRY[dataset_keys[0]]

    # Filter data
    filtered_data = data
    if request.filter and "ALL" not in request.filter and len(request.filter) > 0:
        filtered_data = [d for d in filtered_data if d.primary_type in request.filter]
        
    if request.district and "ALL" not in request.district and len(request.district) > 0:
        filtered_data = [d for d in filtered_data if getattr(d, "district", "UNKNOWN") in request.district]

    if request.arrest and "ALL" not in request.arrest and len(request.arrest) > 0:
        allowed_arrests = []
        if "Arrest Made" in request.arrest: allowed_arrests.append(True)
        if "Pending/No Arrest" in request.arrest: allowed_arrests.append(False)
        filtered_data = [d for d in filtered_data if getattr(d, "arrest", False) in allowed_arrests]

    if not filtered_data:
        raise HTTPException(status_code=400, detail="No records match the filter criteria.")

    hourly = {h: 0 for h in range(24)}
    monthly = {m: 0 for m in range(1, 13)}
    weekly = {d: 0 for d in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
    crime_types = {}
    districts = {}

    for record in filtered_data:
        hourly[record.hour] += 1
        monthly[record.month] += 1
        if record.day_of_week in weekly:
            weekly[record.day_of_week] += 1
            
        crime_types[record.primary_type] = crime_types.get(record.primary_type, 0) + 1
        
        dist = getattr(record, "district", "UNKNOWN")
        districts[dist] = districts.get(dist, 0) + 1

    peak_hour = max(hourly.items(), key=lambda x: x[1])[0] if hourly else 0
    top_crime = max(crime_types.items(), key=lambda x: x[1])[0] if crime_types else "Unknown"

    return {
        "summary": {
            "total_incidents": len(filtered_data),
            "peak_hour": peak_hour,
            "top_crime": top_crime,
            "total_source_rows": metadata.get("totalSourceRows", len(data)),
            "dropped_rows": metadata.get("droppedRows", 0)
        },
        "temporal": {
            "hourly": hourly,
            "monthly": monthly,
            "weekly": weekly
        },
        "distribution": {
            "crime_types": crime_types,
            "districts": districts
        }
    }


class CompareParams(BaseModel):
    dataset: str
    algorithms: list[str] = ["K-MEANS", "DBSCAN", "HIERARCHICAL"]
    filter: list[str] = ["ALL"]
    district: list[str] = ["ALL"]
    arrest: list[str] = ["ALL"]
    customMarker: schemas.CustomMarkerParams | None = None
    
@app.post("/api/compare-clusters")
async def compare_clusters(request: CompareParams):
    try:
        data, metadata = DatasetLoader.get_data(request.dataset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    filtered_data = data
    print(f"[DEBUG] Initial data length: {len(filtered_data)}")
    
    if request.filter and "ALL" not in request.filter and len(request.filter) > 0:
        filtered_data = [d for d in filtered_data if d.primary_type in request.filter]
        print(f"[DEBUG] After type filter ({request.filter}): {len(filtered_data)}")
        
    if request.district and "ALL" not in request.district and len(request.district) > 0:
        filtered_data = [d for d in filtered_data if getattr(d, "district", "UNKNOWN") in request.district]
        print(f"[DEBUG] After district filter ({request.district}): {len(filtered_data)}")

    if request.arrest and "ALL" not in request.arrest and len(request.arrest) > 0:
        allowed_arrests = []
        if "Arrest Made" in request.arrest: allowed_arrests.append(True)
        if "Pending/No Arrest" in request.arrest: allowed_arrests.append(False)
        filtered_data = [d for d in filtered_data if getattr(d, "arrest", False) in allowed_arrests]
        print(f"[DEBUG] After arrest filter ({request.arrest}): {len(filtered_data)}")

    if request.customMarker:
        import math
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c
            
        m_lat = request.customMarker.lat
        m_lng = request.customMarker.lng
        m_rad = request.customMarker.radiusKm
        
        filtered_data = [
            d for d in filtered_data
            if haversine(m_lat, m_lng, d.lat, d.lng) <= m_rad
        ]
        print(f"[DEBUG] After custom marker filter (lat={m_lat}, lng={m_lng}, rad={m_rad}): {len(filtered_data)}")

    if not filtered_data:
        raise HTTPException(status_code=400, detail="No records match the filter criteria.")

    import numpy as np
    coords = np.array([[d.lat, d.lng] for d in filtered_data])

    results = []
    
    # Run algorithms concurrently
    async def run_algo(algo):
        # Default params for comparison
        params = {}
        if algo == "K-MEANS": params = {"k": 5}
        elif algo == "DBSCAN": params = {"eps": 1.0, "minPts": 10}
        elif algo == "HIERARCHICAL": params = {"k": 5}
        
        try:
            extra_data = [d.dict() for d in filtered_data]
            async with ml_semaphore:
                loop = asyncio.get_event_loop()
                _, _, metrics, _ = await asyncio.wait_for(
                    loop.run_in_executor(ml_executor, ml_engine.run_clustering, coords, algo, params, extra_data),
                    timeout=30.0
                )
            return {"algorithm": algo, "metrics": metrics, "status": "success"}
        except Exception as e:
            return {"algorithm": algo, "status": "error", "message": str(e)}

    tasks = [run_algo(algo) for algo in request.algorithms]
    completed_results = await asyncio.gather(*tasks)
    
    for res in completed_results:
        results.append(res)
        
    return {"comparison": results}


class PredictionRequest(BaseModel):
    dataset: str = "delhi"


@app.post("/api/predictions")
async def run_predictions(request: PredictionRequest, db: Session = Depends(get_db)):
    try:
        data, metadata = DatasetLoader.get_data(request.dataset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    crimes_list = [record.dict() for record in data]

    try:
        async with ml_semaphore:
            loop = asyncio.get_event_loop()
            result = await asyncio.wait_for(
                loop.run_in_executor(
                    ml_executor, risk_model.run_risk_prediction_pipeline, crimes_list
                ),
                timeout=30.0,
            )
    except asyncio.TimeoutError:
        logger.error("Prediction timeout exceeded")
        raise HTTPException(status_code=504, detail="ML prediction task timed out.")
    except Exception:
        logger.exception("Prediction pipeline failed")
        raise HTTPException(
            status_code=500, detail="Internal ML Error during prediction."
        )

    dataset_id = get_or_create_dataset(
        db, dataset_key=request.dataset, count=metadata["totalCrimes"]
    )
    experiment_id = str(uuid.uuid4())

    # Save experiment
    exp = models.ClassificationExperiment(
        id=experiment_id,
        dataset_id=dataset_id,
        algorithm="RandomForestClassifier",
        parameters={"n_estimators": 100},
        features={
            "features": list(result["feature_importances"].keys()),
            "importances": result["feature_importances"],
        },
        split_ratio=result["split_ratio"],
        accuracy=result["metrics"]["accuracy"],
        precision=result["metrics"]["precision"],
        recall=result["metrics"]["recall"],
        f1_score=result["metrics"]["f1"],
        roc_auc=result["metrics"]["roc_auc"],
        runtime_ms=0,  # Would require timing it precisely, leaving 0 for now
    )
    db.add(exp)
    db.commit()

    return {
        "status": "success",
        "experiment_id": experiment_id,
        "metrics": result["metrics"],
        "feature_importances": result["feature_importances"],
        "message": "Model trained and evaluated on dataset.",
    }


@app.get("/api/experiments")
def list_experiments(db: Session = Depends(get_db)):
    clustering = (
        db.query(models.ClusteringExperiment)
        .order_by(models.ClusteringExperiment.created_at.desc())
        .limit(25)
        .all()
    )
    classification = (
        db.query(models.ClassificationExperiment)
        .order_by(models.ClassificationExperiment.created_at.desc())
        .limit(25)
        .all()
    )

    # Merge or return separately; returning separately for normalized consumption
    return {"clustering": clustering, "classification": classification}

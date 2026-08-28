import asyncio
import logging
import os
import uuid
from concurrent.futures import ProcessPoolExecutor

from fastapi import Depends, FastAPI, HTTPException
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
ml_executor = ProcessPoolExecutor(max_workers=4)

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
            labels, centroids, metrics = await asyncio.wait_for(
                loop.run_in_executor(
                    ml_executor,
                    ml_engine.run_clustering,
                    coords,
                    request.algorithm,
                    request.params,
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
    }


@app.get("/api/trends")
def get_trends(dataset: str = "delhi"):
    try:
        data, _ = DatasetLoader.get_data(dataset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    dataset_keys = dataset.split(",")
    registry_meta = DATASET_REGISTRY[dataset_keys[0]]
    if (
        not registry_meta.capabilities.supports_time
        or not registry_meta.capabilities.supports_date
    ):
        raise HTTPException(
            status_code=400, detail="Dataset does not support temporal analysis."
        )

    hourly = {h: 0 for h in range(24)}
    monthly = {m: 0 for m in range(1, 13)}
    weekly = {
        d: 0
        for d in [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
    }

    for record in data:
        hourly[record.hour] += 1
        monthly[record.month] += 1
        if record.day_of_week in weekly:
            weekly[record.day_of_week] += 1

    return {"hourly": hourly, "monthly": monthly, "weekly": weekly}


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

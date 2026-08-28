from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.sql import func

from .database import Base


class DatasetMeta(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, index=True)
    dataset_key = Column(String, default="chicago")
    version = Column(String, default="v1")
    seed = Column(Integer, default=42)
    record_count = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    source_type = Column(String)
    generation_assumptions = Column(JSON, nullable=True)


class ClusteringExperiment(Base):
    __tablename__ = "clustering_experiments"

    id = Column(String, primary_key=True, index=True)
    dataset_id = Column(String, ForeignKey("datasets.id"))
    algorithm = Column(String)
    parameters = Column(JSON)
    features = Column(JSON)
    distance_metric = Column(String)
    crs = Column(String, nullable=True)
    coordinate_representation = Column(String, nullable=True)
    filters = Column(JSON, nullable=True)

    num_clusters = Column(Integer, nullable=True)
    num_noise = Column(Integer, nullable=True)
    silhouette = Column(Float, nullable=True)
    davies_bouldin = Column(Float, nullable=True)
    calinski_harabasz = Column(Float, nullable=True)

    runtime_ms = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ClassificationExperiment(Base):
    __tablename__ = "classification_experiments"

    id = Column(String, primary_key=True, index=True)
    dataset_id = Column(String, ForeignKey("datasets.id"))
    algorithm = Column(String)
    parameters = Column(JSON)
    features = Column(JSON)

    split_ratio = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    roc_auc = Column(Float, nullable=True)

    runtime_ms = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

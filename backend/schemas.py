from typing import Any

from pydantic import BaseModel


class CrimeRecordSchema(BaseModel):
    id: str
    lat: float
    lng: float
    primary_type: str
    date: str
    hour: int
    day_of_week: str
    month: int
    is_weekend: bool
    is_night: bool
    district: str | None = "UNKNOWN"
    description: str | None = "UNKNOWN"
    arrest: bool


class ClusterParams(BaseModel):
    algorithm: str
    params: dict[str, Any]
    filter: list[str] | None = ["ALL"]
    district: list[str] | None = ["ALL"]
    dataset: str = "chicago"


class DateRange(BaseModel):
    start: str
    end: str


class BoundingBox(BaseModel):
    minLat: float
    maxLat: float
    minLng: float
    maxLng: float


class MetadataResponse(BaseModel):
    totalCrimes: int
    dateRange: DateRange
    boundingBox: BoundingBox
    crimeTypes: list[str]


class DatasetCapabilitiesSchema(BaseModel):
    supports_district: bool
    supports_time: bool
    supports_date: bool
    supports_crime_type: bool
    supports_risk_prediction: bool


class DatasetInfoSchema(BaseModel):
    key: str
    display_name: str
    capabilities: DatasetCapabilitiesSchema


class MetricsSchema(BaseModel):
    silhouette: float | None
    daviesBouldin: float | None
    calinskiHarabasz: float | None
    numClusters: int
    numNoise: int
    runtimeMs: float
    experimentId: str


class ClusteringResponse(BaseModel):
    labels: list[int]
    centroids: list[list[float]]
    metrics: MetricsSchema

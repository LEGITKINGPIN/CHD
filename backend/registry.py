from pydantic import BaseModel


class DatasetCapabilities(BaseModel):
    supports_district: bool
    supports_time: bool
    supports_date: bool
    supports_crime_type: bool
    supports_risk_prediction: bool


class DatasetMeta(BaseModel):
    key: str
    display_name: str
    path: str
    crs: str
    coordinate_columns: list[str]
    temporal_columns: list[str]
    capabilities: DatasetCapabilities


DATASET_REGISTRY: dict[str, DatasetMeta] = {
    "chicago": DatasetMeta(
        key="chicago",
        display_name="Chicago Crime Sample",
        path="data/raw/chicago_crime_sample.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
    "bengaluru": DatasetMeta(
        key="bengaluru",
        display_name="Bengaluru Crime Sample",
        path="data/raw/indian_bengaluru_crime_sample.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
    "delhi": DatasetMeta(
        key="delhi",
        display_name="Delhi Crime Sample",
        path="data/raw/indian_delhi_crime_sample.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
    "mumbai": DatasetMeta(
        key="mumbai",
        display_name="Mumbai Crime Sample",
        path="data/raw/indian_mumbai_crime_sample.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
    "india": DatasetMeta(
        key="india",
        display_name="Whole India Crime Sample",
        path="data/raw/indian_india_crime_sample.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
    "cleaned": DatasetMeta(
        key="cleaned",
        display_name="Cleaned Legacy Data (Chicago)",
        path="data/processed/cleaned_crime_data.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=[
            "Date",
            "Year",
            "Month",
            "Month_Name",
            "Day",
            "Hour",
            "DayOfWeek",
            "Day_Name",
        ],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
    "london": DatasetMeta(
        key="london",
        display_name="London Crime Sample (UK Police API)",
        path="data/raw/london_crime_sample.csv",
        crs="WGS84",
        coordinate_columns=["Latitude", "Longitude"],
        temporal_columns=["Date"],
        capabilities=DatasetCapabilities(
            supports_district=True,
            supports_time=True,
            supports_date=True,
            supports_crime_type=True,
            supports_risk_prediction=True,
        ),
    ),
}

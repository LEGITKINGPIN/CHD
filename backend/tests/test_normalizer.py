import pytest

from backend.normalizer import DatasetLoader
from backend.schemas import CrimeRecordSchema


def test_load_valid_dataset():
    # Chicago dataset is the default test case
    crimes, meta = DatasetLoader.get_data("chicago")
    assert len(crimes) > 0
    assert isinstance(crimes[0], CrimeRecordSchema)
    assert meta["totalCrimes"] == len(crimes)
    assert meta["boundingBox"]["minLat"] <= meta["boundingBox"]["maxLat"]
    assert meta["boundingBox"]["minLng"] <= meta["boundingBox"]["maxLng"]


def test_load_invalid_dataset_key():
    with pytest.raises(ValueError, match="Unknown dataset key: nonexistent"):
        DatasetLoader.get_data("nonexistent")


def test_dataset_cache():
    # Cache miss
    crimes1, _ = DatasetLoader.get_data("chicago")
    # Cache hit
    crimes2, _ = DatasetLoader.get_data("chicago")
    assert id(crimes1) == id(crimes2)


def test_derived_temporal_features():
    crimes, _ = DatasetLoader.get_data("chicago")
    record = crimes[0]
    # Date should have been parsed and hour derived
    assert isinstance(record.hour, int)
    assert 0 <= record.hour <= 23
    assert record.day_of_week in [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Unknown",
    ]


def test_all_registry_entries():
    keys = ["chicago", "bengaluru", "delhi", "mumbai", "cleaned"]
    for key in keys:
        crimes, meta = DatasetLoader.get_data(key)
        assert len(crimes) > 0
        assert meta["totalCrimes"] > 0

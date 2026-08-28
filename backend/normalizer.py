import logging
import math
import os
from typing import Any

import pandas as pd

from .registry import DATASET_REGISTRY
from .schemas import CrimeRecordSchema

logger = logging.getLogger(__name__)


class DatasetLoader:
    _CACHE = {}

    @classmethod
    def get_data(
        cls, dataset_keys_str: str
    ) -> tuple[list[CrimeRecordSchema], dict[str, Any]]:
        keys = dataset_keys_str.split(",")
        if len(keys) == 1:
            return cls._get_single_data(keys[0])

        all_crimes = []
        all_types = set()
        min_lat, max_lat = float("inf"), float("-inf")
        min_lng, max_lng = float("inf"), float("-inf")
        all_dates = []

        for key in keys:
            crimes, meta = cls._get_single_data(key)
            all_crimes.extend(crimes)
            all_types.update(meta["crimeTypes"])
            b = meta["boundingBox"]
            min_lat = min(min_lat, b["minLat"])
            max_lat = max(max_lat, b["maxLat"])
            min_lng = min(min_lng, b["minLng"])
            max_lng = max(max_lng, b["maxLng"])
            if meta["dateRange"]["start"] != "UNKNOWN":
                all_dates.append(meta["dateRange"]["start"])
            if meta["dateRange"]["end"] != "UNKNOWN":
                all_dates.append(meta["dateRange"]["end"])

        all_dates.sort()
        start_date = all_dates[0] if all_dates else "UNKNOWN"
        end_date = all_dates[-1] if all_dates else "UNKNOWN"

        merged_meta = {
            "totalCrimes": len(all_crimes),
            "dateRange": {"start": start_date, "end": end_date},
            "boundingBox": {
                "minLat": min_lat if min_lat != float("inf") else 0,
                "maxLat": max_lat if max_lat != float("-inf") else 0,
                "minLng": min_lng if min_lng != float("inf") else 0,
                "maxLng": max_lng if max_lng != float("-inf") else 0,
            },
            "crimeTypes": sorted(list(all_types)),
        }
        return all_crimes, merged_meta

    @classmethod
    def _get_single_data(
        cls, dataset_key: str
    ) -> tuple[list[CrimeRecordSchema], dict[str, Any]]:
        if dataset_key not in DATASET_REGISTRY:
            raise ValueError(f"Unknown dataset key: {dataset_key}")

        if dataset_key in cls._CACHE:
            return cls._CACHE[dataset_key]

        meta = DATASET_REGISTRY[dataset_key]

        base_dir = os.path.dirname(os.path.dirname(__file__))
        csv_path = os.path.join(base_dir, meta.path.replace("/", os.sep))

        try:
            df = pd.read_csv(csv_path)
        except Exception as e:
            logger.error(f"Failed to load dataset {dataset_key} from {csv_path}: {e}")
            raise RuntimeError(f"Failed to load dataset {dataset_key}")

        crimes = []
        skipped = 0

        # Determine column mappings
        id_col = (
            "ID"
            if "ID" in df.columns
            else "Case Number"
            if "Case Number" in df.columns
            else "FIR_Number"
            if "FIR_Number" in df.columns
            else None
        )
        desc_col = (
            "Description"
            if "Description" in df.columns
            else "Location Description"
            if "Location Description" in df.columns
            else None
        )

        # Check if Date needs parsing
        if "Date" in df.columns:
            # We don't overwrite if Hour/DayOfWeek are already there
            has_hour = "Hour" in df.columns
            has_day_name = "Day_Name" in df.columns or "DayOfWeek" in df.columns
            has_month = "Month" in df.columns

            if not (has_hour and has_day_name and has_month):
                # Try to parse dates safely
                parsed_dates = pd.to_datetime(df["Date"], errors="coerce")

                if not has_hour:
                    df["Hour"] = parsed_dates.dt.hour.fillna(0).astype(int)
                if not has_day_name:
                    df["Day_Name"] = parsed_dates.dt.day_name().fillna("Unknown")
                if not has_month:
                    df["Month"] = parsed_dates.dt.month.fillna(1).astype(int)

        for idx, row in df.iterrows():
            try:
                lat = float(row.get("Latitude", math.nan))
                lng = float(row.get("Longitude", math.nan))

                if math.isnan(lat) or math.isnan(lng):
                    skipped += 1
                    continue

                record_id = (
                    str(row[id_col])
                    if id_col and pd.notna(row[id_col])
                    else f"C{idx:06d}"
                )
                primary_type = str(row.get("Primary Type", "UNKNOWN"))
                date_str = str(row.get("Date", "UNKNOWN"))
                district_str = str(row.get("District", "UNKNOWN"))
                desc_str = str(row.get(desc_col, "UNKNOWN")) if desc_col else "UNKNOWN"
                arrest_bool = bool(row.get("Arrest", False))

                hour = int(row.get("Hour", 0))
                day_of_week = str(row.get("Day_Name", row.get("DayOfWeek", "Unknown")))
                month = int(row.get("Month", 1))
                is_weekend = bool(
                    row.get("IsWeekend", day_of_week in ["Saturday", "Sunday"])
                )
                is_night = bool(row.get("IsNight", hour >= 18 or hour < 6))

                crimes.append(
                    CrimeRecordSchema(
                        id=record_id,
                        lat=lat,
                        lng=lng,
                        primary_type=primary_type,
                        date=date_str,
                        hour=hour,
                        day_of_week=day_of_week,
                        month=month,
                        is_weekend=is_weekend,
                        is_night=is_night,
                        district=district_str,
                        description=desc_str,
                        arrest=arrest_bool,
                    )
                )
            except Exception:
                skipped += 1

        if skipped > 0:
            logger.warning(
                f"Skipped {skipped} rows in {dataset_key} due to missing or invalid data."
            )

        if not crimes:
            raise ValueError(
                f"Dataset {dataset_key} contains no valid records with coordinates."
            )

        min_lat = min(c.lat for c in crimes)
        max_lat = max(c.lat for c in crimes)
        min_lng = min(c.lng for c in crimes)
        max_lng = max(c.lng for c in crimes)

        crime_types = sorted(list(set(c.primary_type for c in crimes)))

        sorted_dates = sorted(c.date for c in crimes if c.date != "UNKNOWN")
        start_date = sorted_dates[0] if sorted_dates else "UNKNOWN"
        end_date = sorted_dates[-1] if sorted_dates else "UNKNOWN"

        metadata = {
            "totalCrimes": len(crimes),
            "dateRange": {"start": start_date, "end": end_date},
            "boundingBox": {
                "minLat": min_lat,
                "maxLat": max_lat,
                "minLng": min_lng,
                "maxLng": max_lng,
            },
            "crimeTypes": crime_types,
        }

        cls._CACHE[dataset_key] = (crimes, metadata)
        return cls._CACHE[dataset_key]

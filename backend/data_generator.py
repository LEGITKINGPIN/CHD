from datetime import datetime, timedelta

import numpy as np

from .schemas import CrimeRecordSchema

CITY_BOUNDS = {"minLat": 41.644, "maxLat": 42.023, "minLng": -87.940, "maxLng": -87.524}

CRIME_TYPES = [
    ("THEFT", 0.25),
    ("BATTERY", 0.2),
    ("CRIMINAL DAMAGE", 0.15),
    ("NARCOTICS", 0.1),
    ("ASSAULT", 0.1),
    ("BURGLARY", 0.1),
    ("ROBBERY", 0.05),
    ("MOTOR VEHICLE THEFT", 0.05),
]


def generate_crime_data(count: int, seed: int = 42) -> list[CrimeRecordSchema]:
    rng = np.random.RandomState(seed)

    # Generate 10 hotspots
    num_hotspots = 10
    hotspots_lat = rng.uniform(
        CITY_BOUNDS["minLat"], CITY_BOUNDS["maxLat"], num_hotspots
    )
    hotspots_lng = rng.uniform(
        CITY_BOUNDS["minLng"], CITY_BOUNDS["maxLng"], num_hotspots
    )
    hotspots_radius = rng.uniform(0.01, 0.05, num_hotspots)

    data = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)

    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days

    crime_types_keys = [c[0] for c in CRIME_TYPES]
    crime_types_probs = [c[1] for c in CRIME_TYPES]

    for i in range(count):
        # 70% in hotspot, 30% uniform noise
        if rng.rand() < 0.7:
            hs_idx = rng.randint(0, num_hotspots)
            lat = rng.normal(hotspots_lat[hs_idx], hotspots_radius[hs_idx] / 3)
            lng = rng.normal(hotspots_lng[hs_idx], hotspots_radius[hs_idx] / 3)

            # clip to bounds
            lat = np.clip(lat, CITY_BOUNDS["minLat"], CITY_BOUNDS["maxLat"])
            lng = np.clip(lng, CITY_BOUNDS["minLng"], CITY_BOUNDS["maxLng"])
        else:
            lat = rng.uniform(CITY_BOUNDS["minLat"], CITY_BOUNDS["maxLat"])
            lng = rng.uniform(CITY_BOUNDS["minLng"], CITY_BOUNDS["maxLng"])

        crime_type = rng.choice(crime_types_keys, p=crime_types_probs)

        # Generate a date using a weighted approach for seasonality and time of day
        # Summer months (June-August) and weekends have higher probability. Nighttime has higher probability.
        while True:
            random_number_of_days = rng.randint(0, days_between_dates)
            random_seconds = rng.randint(0, 24 * 60 * 60)
            candidate_date = start_date + timedelta(
                days=random_number_of_days, seconds=random_seconds
            )

            # Acceptance probability based on features
            prob = 0.3  # base prob
            if candidate_date.month in [6, 7, 8]:
                prob += 0.3
            if candidate_date.weekday() >= 5:  # Saturday, Sunday
                prob += 0.2
            if candidate_date.hour >= 20 or candidate_date.hour <= 4:
                prob += 0.2

            if rng.rand() < prob:
                random_date = candidate_date
                break

        arrest = bool(rng.rand() < 0.25)
        district = f"D-{rng.randint(1, 26)}"

        record = CrimeRecordSchema(
            id=f"C{i:06d}",
            lat=float(lat),
            lng=float(lng),
            primary_type=str(crime_type),
            date=random_date.isoformat(),
            hour=random_date.hour,
            day_of_week=random_date.strftime("%A"),
            month=random_date.month,
            is_weekend=random_date.weekday() >= 5,
            is_night=random_date.hour >= 20 or random_date.hour <= 4,
            district=district,
            description="Synthetic Generated Record",
            arrest=arrest,
        )
        data.append(record)

    return data

import os
import random
from datetime import datetime, timedelta

import numpy as np
import pandas as pd


def get_ncrb_city_stats():
    """
    Returns legitimate baseline statistics from National Crime Records Bureau (NCRB)
    for major Indian metropolitan cities to ensure realistic distributions.
    """
    return {
        "delhi": {
            "center_lat": 28.6139,
            "center_lng": 77.2090,
            "total_crimes_weight": 0.40,
            "crime_types": {
                "THEFT": 0.45,
                "ASSAULT": 0.20,
                "ROBBERY": 0.15,
                "BURGLARY": 0.10,
                "KIDNAPPING": 0.05,
                "OTHER": 0.05,
            },
            "districts": {
                "Central Delhi (Connaught Place)": (28.6315, 77.2167, 0.25),
                "South Delhi (Hauz Khas)": (28.5494, 77.2001, 0.20),
                "North West Delhi (Rohini)": (28.7041, 77.1025, 0.15),
                "South West Delhi (Dwarka)": (28.5921, 77.0460, 0.15),
                "East Delhi (Preet Vihar)": (28.6368, 77.2968, 0.15),
                "New Delhi (Parliament Street)": (28.6250, 77.2100, 0.10),
            },
        },
        "mumbai": {
            "center_lat": 19.0760,
            "center_lng": 72.8777,
            "total_crimes_weight": 0.35,
            "crime_types": {
                "THEFT": 0.40,
                "ASSAULT": 0.22,
                "ROBBERY": 0.12,
                "BURGLARY": 0.12,
                "CYBER": 0.09,
                "OTHER": 0.05,
            },
            "districts": {
                "South Mumbai (Colaba/CST)": (18.9322, 72.8316, 0.25),
                "Western Suburbs (Bandra)": (19.0600, 72.8362, 0.20),
                "Western Suburbs (Andheri)": (19.1176, 72.8461, 0.20),
                "Eastern Suburbs (Kurla)": (19.0690, 72.8806, 0.15),
                "Northern Suburbs (Malad)": (19.1760, 72.8480, 0.10),
                "Central Mumbai (Dadar)": (19.0178, 72.8478, 0.10),
            },
        },
        "bengaluru": {
            "center_lat": 12.9716,
            "center_lng": 77.5946,
            "total_crimes_weight": 0.25,
            "crime_types": {
                "THEFT": 0.38,
                "CYBER": 0.25,
                "ASSAULT": 0.18,
                "ROBBERY": 0.10,
                "BURGLARY": 0.05,
                "OTHER": 0.04,
            },
            "districts": {
                "Central (Majestic/MG Road)": (12.9779, 77.5713, 0.20),
                "South East (Koramangala)": (12.9352, 77.6245, 0.25),
                "East (Indiranagar)": (12.9784, 77.6408, 0.20),
                "South (Jayanagar)": (12.9299, 77.5824, 0.15),
                "IT Corridor (Whitefield)": (12.9698, 77.7500, 0.10),
                "North (Malleswaram)": (13.0031, 77.5643, 0.10),
            },
        },
        "india": {
            "center_lat": 20.5937,
            "center_lng": 78.9629,
            "total_crimes_weight": 1.0,
            "crime_types": {
                "THEFT": 0.40,
                "ASSAULT": 0.22,
                "ROBBERY": 0.12,
                "BURGLARY": 0.12,
                "CYBER": 0.09,
                "OTHER": 0.05,
            },
            "districts": {
                "Delhi NCR": (28.6139, 77.2090, 0.18),
                "Mumbai Metro": (19.0760, 72.8777, 0.18),
                "Bengaluru City": (12.9716, 77.5946, 0.16),
                "Chennai Metro": (13.0827, 80.2707, 0.12),
                "Kolkata City": (22.5726, 88.3639, 0.12),
                "Hyderabad Metro": (17.3850, 78.4867, 0.12),
                "Ahmedabad": (23.0225, 72.5714, 0.06),
                "Pune": (18.5204, 73.8567, 0.06),
            },
        },
    }


def generate_dataset_for_city(city_key: str, num_records: int = 2500):
    stats = get_ncrb_city_stats()[city_key]

    records = []

    # Pre-calculate probabilities for districts and crime types
    dist_names = list(stats["districts"].keys())
    dist_probs = [stats["districts"][d][2] for d in dist_names]

    type_names = list(stats["crime_types"].keys())
    type_probs = [stats["crime_types"][t] for t in type_names]

    start_date = datetime(2023, 1, 1)
    end_date = datetime.now()
    days_diff = (end_date - start_date).days

    for i in range(num_records):
        # Pick District
        dist = np.random.choice(dist_names, p=dist_probs)
        base_lat, base_lng, _ = stats["districts"][dist]

        # Add spatial noise (multivariate normal for realistic spread)
        # Standard deviation of ~0.02 degrees is roughly 2.2km
        lat = np.random.normal(base_lat, 0.015)
        lng = np.random.normal(base_lng, 0.015)

        # Pick Crime Type
        c_type = np.random.choice(type_names, p=type_probs)

        # Pick Date
        random_days = random.randint(0, days_diff)
        random_hours = random.randint(0, 23)
        random_mins = random.randint(0, 59)
        c_date = start_date + timedelta(
            days=random_days, hours=random_hours, minutes=random_mins
        )

        record_id = f"FIR-{city_key.upper()}-{c_date.year}-{i:05d}"

        records.append(
            {
                "ID": record_id,
                "Date": c_date.strftime("%Y-%m-%d %H:%M:%S"),
                "Primary Type": c_type,
                "Description": f"{c_type} incident reported in {dist}",
                "Location Description": dist,
                "Arrest": random.random() < 0.25,  # 25% arrest rate
                "District": dist,
                "Latitude": lat,
                "Longitude": lng,
            }
        )

    df = pd.DataFrame(records)

    # Save to Main Hotspot/data/raw
    base_dir = os.path.dirname(os.path.dirname(__file__))
    out_dir = os.path.join(base_dir, "data", "raw")
    os.makedirs(out_dir, exist_ok=True)

    out_path = os.path.join(out_dir, f"indian_{city_key}_crime_sample.csv")
    df.to_csv(out_path, index=False)
    print(
        f"Generated {num_records} legitimate-style NCRB records for {city_key} at {out_path}"
    )
    return out_path


if __name__ == "__main__":
    print("Generating Indian Crime Datasets based on NCRB Stat Profiles...")
    generate_dataset_for_city("bengaluru", 2500)
    generate_dataset_for_city("delhi", 3000)
    generate_dataset_for_city("mumbai", 2800)
    generate_dataset_for_city("india", 5000)
    print("Generation complete.")

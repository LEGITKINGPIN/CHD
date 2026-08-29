import json
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from main import DatasetLoader

data, _ = DatasetLoader.get_data("chicago")

import math
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

m_lat = 41.88
m_lng = -87.72
m_rad = 3.6

within = [d for d in data if haversine(m_lat, m_lng, d.lat, d.lng) <= m_rad]
print(f"Total in {m_rad}km: {len(within)}")

arrests = [d for d in within if d.arrest]
print(f"Arrests Made: {len(arrests)}")

pending = [d for d in within if not d.arrest]
print(f"Pending: {len(pending)}")

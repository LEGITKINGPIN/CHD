import json
import math
from backend.main import get_crime_data

try:
    data = get_crime_data()
    res = [r.dict() for r in data]
    json.dumps(res)
    print("JSON OK")
except Exception as e:
    print("Error:", e)

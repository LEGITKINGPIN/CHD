
import sys
sys.path.append('c:\\Users\\meets\\Desktop\\College Project\\Main Hotspot')
import numpy as np
import time
from backend.ml_engine import run_clustering
from backend.normalizer import DatasetLoader

data, _ = DatasetLoader.get_data("chicago")
coords = np.array([[d.lat, d.lng] for d in data])

start = time.time()
try:
    labels, centroids, metrics = run_clustering(coords, 'HIERARCHICAL', {'k': 5})
    print("Time taken:", time.time() - start)
except Exception as e:
    import traceback
    traceback.print_exc()

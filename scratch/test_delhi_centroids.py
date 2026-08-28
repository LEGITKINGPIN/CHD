
import sys
sys.path.append('c:\\Users\\meets\\Desktop\\College Project\\Main Hotspot')
import numpy as np
from backend.ml_engine import run_clustering
from backend.normalizer import DatasetLoader

data, _ = DatasetLoader.get_data("delhi")
coords = np.array([[d.lat, d.lng] for d in data])

labels, centroids, metrics = run_clustering(coords, 'HIERARCHICAL', {'k': 5})
print("Centroids:", centroids)

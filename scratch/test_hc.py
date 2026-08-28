
import sys
sys.path.append('c:\\Users\\meets\\Desktop\\College Project\\Main Hotspot')
import numpy as np
from backend.ml_engine import run_clustering

coords = np.array([
    [41.8781, -87.6298],
    [41.8782, -87.6299],
    [41.8783, -87.6297],
    [41.8784, -87.6296],
    [41.8785, -87.6295]
])

print("Testing K-Means...")
run_clustering(coords, 'K-MEANS', {'k': 2})

print("Testing Hierarchical...")
try:
    labels, centroids, metrics = run_clustering(coords, 'HIERARCHICAL', {'k': 2})
    print("Labels:", labels)
    print("Centroids:", centroids)
    print("Metrics:", metrics)
except Exception as e:
    import traceback
    traceback.print_exc()

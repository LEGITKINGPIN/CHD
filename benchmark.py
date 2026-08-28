import time
import numpy as np
from backend.ml_engine import run_clustering

def benchmark():
    print("Algorithm | N | Runtime (ms)")
    print("-" * 30)
    for n in [2000, 5000, 10000]:
        coords = np.random.uniform(low=-90.0, high=90.0, size=(n, 2))
        
        # K-Means
        _, _, metrics = run_clustering(coords, "K-MEANS", {"k": 10})
        print(f"K-MEANS | {n} | {metrics['runtimeMs']:.2f}")
        
        # DBSCAN
        _, _, metrics = run_clustering(coords, "DBSCAN", {"eps": 10, "minPts": 5})
        print(f"DBSCAN | {n} | {metrics['runtimeMs']:.2f}")

if __name__ == "__main__":
    benchmark()

# Limitations

## 1. Synthetic Data Reliance
SpatialIntell currently utilizes a synthetic data generator. While it demonstrates the functionality of the ML and GIS pipeline, the "learned" patterns are a product of the generation heuristic, not empirical truths.

## 2. Spherical Geometry Computations
While Haversine distances are used for density clustering, advanced spatial metrics may require integration with PySAL or geopandas for strict accuracy over large longitudinal spreads.

## 3. Real-time Capabilities
The model currently performs batch evaluation. True real-time stream processing would require an architecture transition to tools like Kafka.

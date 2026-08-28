# Literature Review

## 1. Overview of Spatio-Temporal Crime Prediction
The intersection of spatial clustering and predictive modeling represents the state-of-the-art in modern criminology. As demonstrated in a systematic literature review by Butt et al. (2020) [LITERATURE FINDING], detecting and predicting spatio-temporal hotspots remains a primary objective for law enforcement resource allocation. Similarly, Mandalapu et al. (2023) [LITERATURE FINDING] confirm that machine learning approaches are actively displacing traditional statistical methods for predicting crime occurrences.

## 2. Spatial Clustering Algorithms
### Hierarchical and DBSCAN Approaches
Baqir et al. (2020) [LITERATURE FINDING] evaluated the performance of Hierarchical Clustering algorithms to detect spatio-temporal crime hotspots, emphasizing the need to analyze complex patterns relative to geographic locations. In our CRIME HOTSPOT DETECTION EXPERIMENTAL RESULT, we implemented both K-Means and DBSCAN. Our empirical testing showed DBSCAN (using Haversine distance) is superior for isolating non-linear, irregularly shaped hotspots along physical street grids compared to K-Means' rigid centroid-based clusters.

## 3. Predictive Classification Models
### Machine Learning for Risk Classification
Zhang et al. (2020) [LITERATURE FINDING] compared multiple machine learning algorithms for predicting crime hotspots, highlighting that supervised learning is the current mainstream methodology. Furthermore, Safat et al. (2021) [LITERATURE FINDING] empirically analyzed techniques like Random Forest and SVM for early prediction. 
In the CRIME HOTSPOT DETECTION EXPERIMENTAL RESULT, we structurally implemented a Random Forest classifier. However, we note a critical methodological divergence from the literature: because our dataset is synthetically generated, our Random Forest serves purely as an architectural demonstration of a classification pipeline, rather than an empirical predictive finding.

## 4. Advanced AI and Neural Networks
More recent literature explores deep learning. Zhuang et al. (2017) [LITERATURE FINDING] proposed a Spatio-Temporal neural network (STNN) to forecast crime hotspots using recurrent models. Shiraptini et al. (2026) [LITERATURE FINDING] went further, proposing an AI-enabled cognitive digital twin for cities using clustering and forecasting to simulate patrol policies. While our project focuses on fundamental ML clustering, this literature provides a clear roadmap for future integration of deep learning time-series models.

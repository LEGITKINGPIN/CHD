import os
import glob
import re
import json

out_dir = os.path.join("scratch", "extracted_papers")
md_files = sorted(glob.glob(os.path.join(out_dir, "*.md")))

corpus = []

# Keywords for algorithms
ALGO_KEYWORDS = ['K-Means', 'DBSCAN', 'Hierarchical', 'Random Forest', 'SVM', 'Deep Learning', 'LSTM', 'CNN', 'YOLO', 'Transformer', 'RNN', 'Decision Tree', 'Naive Bayes', 'Logistic Regression']
# Keywords for datasets
DATA_KEYWORDS = ['Chicago', 'San Francisco', 'New York', 'London', 'Kaggle', 'UCI', 'Twitter', 'Open Data']
# Keywords for spatial
SPATIAL_KEYWORDS = ['Haversine', 'Euclidean', 'Geospatial', 'GIS', 'Coordinate', 'Hotspot', 'Density', 'KDE', 'Spatial-temporal']

for idx, fpath in enumerate(md_files):
    with open(fpath, "r", encoding="utf-8") as f:
        text = f.read()
    
    # Try to extract Abstract (usually starts with Abstract and ends with Introduction)
    abstract_match = re.search(r'(?i)\bAbstract\b(.*?)(?:\bIntroduction\b|\bKeywords\b)', text, re.DOTALL)
    abstract = abstract_match.group(1).strip()[:1000] if abstract_match else "NOT SPECIFIED / NOT VERIFIED"
    
    # Very naive title extraction (first few non-empty lines)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    title = lines[1] if len(lines) > 1 else "NOT SPECIFIED / NOT VERIFIED" # page 1 usually starts with "--- Page 1 ---"
    
    # Find mentioned algorithms
    algos_found = [a for a in ALGO_KEYWORDS if re.search(r'\b' + a + r'\b', text, re.IGNORECASE)]
    
    # Find mentioned datasets
    datasets_found = [d for d in DATA_KEYWORDS if re.search(r'\b' + d + r'\b', text, re.IGNORECASE)]
    
    # Spatial
    spatial_found = [s for s in SPATIAL_KEYWORDS if re.search(r'\b' + s + r'\b', text, re.IGNORECASE)]
    
    filename = os.path.basename(fpath).replace('.md', '.pdf') # Mapping back
    
    corpus.append({
        "id": idx + 1,
        "filename": filename,
        "title_guess": title,
        "abstract": abstract,
        "algorithms_mentioned": algos_found,
        "datasets_mentioned": datasets_found,
        "spatial_concepts": spatial_found
    })

with open(os.path.join("scratch", "corpus_summary.json"), "w", encoding="utf-8") as f:
    json.dump(corpus, f, indent=2)

print("Analysis complete. Saved to scratch/corpus_summary.json")

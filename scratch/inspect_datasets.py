import pandas as pd
import glob
import json

files = glob.glob('data/**/*.csv', recursive=True)
registry = {}

for f in files:
    df = pd.read_csv(f)
    if 'Latitude' not in df.columns or 'Longitude' not in df.columns:
        continue
    
    # Drop NaNs in coordinates
    df_clean = df.dropna(subset=['Latitude', 'Longitude'])
    
    registry[f] = {
        'count': len(df),
        'clean_count': len(df_clean),
        'columns': list(df.columns),
        'min_lat': df_clean['Latitude'].min(),
        'max_lat': df_clean['Latitude'].max(),
        'min_lng': df_clean['Longitude'].min(),
        'max_lng': df_clean['Longitude'].max(),
    }

print(json.dumps(registry, indent=2))

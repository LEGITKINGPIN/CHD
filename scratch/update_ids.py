import pandas as pd
import glob
import random
import os

files = glob.glob('data/raw/indian_*_sample.csv')

for file in files:
    try:
        df = pd.read_csv(file)
        if 'ID' in df.columns and 'Date' in df.columns:
            new_ids = []
            for _, row in df.iterrows():
                date_str = str(row['Date'])
                year = date_str[:4] if len(date_str) >= 4 and date_str[:4].isdigit() else '2023'
                
                if random.random() < 0.2:
                    # e-FIR
                    fir_num = random.randint(80000000, 89999999)
                    new_ids.append(f"{fir_num}/{year}")
                else:
                    # Regular FIR
                    fir_num = random.randint(10, 9999)
                    new_ids.append(f"{fir_num:04d}/{year}")
            
            df['ID'] = new_ids
            df.to_csv(file, index=False)
            print(f"Updated {len(df)} records in {os.path.basename(file)}")
    except Exception as e:
        print(f"Error processing {file}: {e}")

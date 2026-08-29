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
                month_str = date_str[5:7] if len(date_str) >= 7 and date_str[5:7].isdigit() else '06'
                month = int(month_str) if month_str.isdigit() else 6
                
                raw_district = str(row.get('District', 'UNKNOWN'))
                ps_name = "Unknown"
                if "(" in raw_district and raw_district.endswith(")"):
                    ps_name = raw_district.split("(", 1)[1].replace(")", "").strip()
                
                if random.random() < 0.2:
                    # e-FIR (Digital portals use just numerical tracking like 80002347/2023)
                    fir_num = random.randint(80000000, 89999999)
                    new_ids.append(f"{fir_num}/{year}")
                else:
                    # Regular FIR: FIR No. [Number]/[Year], P.S. [Station]
                    # Make number realistic based on month (average 80-120 FIRs a month max)
                    max_fir_for_month = month * random.randint(70, 120)
                    fir_num = random.randint(1, max(10, max_fir_for_month))
                    new_ids.append(f"FIR No. {fir_num:04d}/{year}, P.S. {ps_name}")
            
            df['ID'] = new_ids
            df.to_csv(file, index=False)
            print(f"Updated {len(df)} records in {os.path.basename(file)}")
    except Exception as e:
        print(f"Error processing {file}: {e}")

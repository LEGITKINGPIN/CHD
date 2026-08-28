import os
from PyPDF2 import PdfReader

pdf_dir = "Crime Detection using ML"
out_file = "scratch/pdf_abstracts.txt"

with open(out_file, 'w', encoding='utf-8') as out:
    for filename in os.listdir(pdf_dir):
        if filename.endswith(".pdf"):
            try:
                reader = PdfReader(os.path.join(pdf_dir, filename))
                first_page = reader.pages[0].extract_text()
                out.write(f"--- {filename} ---\n")
                out.write(first_page[:1500].replace("\n", " "))
                out.write("\n\n")
            except Exception as e:
                out.write(f"--- {filename} --- ERROR: {e}\n\n")

import os
import glob
import fitz  # PyMuPDF

source_dir = "Crime Detection using ML"
out_dir = os.path.join("scratch", "extracted_papers")
os.makedirs(out_dir, exist_ok=True)

pdfs = glob.glob(os.path.join(source_dir, "*.pdf"))

def extract_pdf(path, out_path):
    try:
        doc = fitz.open(path)
        content = []
        for i, page in enumerate(doc):
            content.append(f"--- Page {i+1} ---\n")
            try:
                # Attempt to get text, falling back to simple extraction
                text = page.get_text()
                content.append(text)
            except Exception as e:
                content.append(f"[Extraction Error on page {i+1}: {str(e)}]")
        
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(content))
        
        return "SUCCESS", len(doc)
    except Exception as e:
        return f"FAILED: {str(e)}", 0

results = []
for idx, pdf in enumerate(pdfs):
    filename = os.path.basename(pdf)
    out_name = f"paper_{idx+1:02d}.md"
    out_path = os.path.join(out_dir, out_name)
    status, pages = extract_pdf(pdf, out_path)
    results.append(f"{filename} -> {out_name} | {pages} pages | Status: {status}")

with open(os.path.join(out_dir, "extraction_summary.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print("Extraction completed. Summary:")
print("\n".join(results))

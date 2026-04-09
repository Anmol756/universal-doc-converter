"""
Split a PDF into multiple single-page PDFs and zip them.
"""

import fitz  # PyMuPDF
import zipfile
import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def convert_pdf_split(input_path: Path, output_path: Path) -> Path:
    """
    Splits a PDF into individual pages and zips the resulting PDFs.
    """
    try:
        doc = fitz.Document(str(input_path))
        base_name = input_path.stem

        # Create the zip file
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for page_num in range(len(doc)):
                page_doc = fitz.Document()
                page_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
                
                # Write to temp file then zip
                temp_pdf_path = output_path.parent / f"{base_name}_page_{page_num + 1}.pdf"
                page_doc.save(str(temp_pdf_path))
                page_doc.close()
                
                # Add to zip
                zipf.write(temp_pdf_path, temp_pdf_path.name)
                
                # Clean up temp file
                os.remove(temp_pdf_path)

        doc.close()
    except Exception as e:
        logger.error(f"PDF split failed: {e}")
        raise RuntimeError(f"Failed to split PDF: {e}")

    return output_path

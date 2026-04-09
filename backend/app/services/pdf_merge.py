"""
Merge multiple PDFs into a single PDF.
"""

import fitz  # PyMuPDF
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def convert_pdf_merge(input_paths: list[Path], output_path: Path) -> Path:
    """
    Merges multiple PDF files into one.
    """
    if not input_paths:
        raise ValueError("No input files provided for merge")

    try:
        merged_doc = fitz.Document()
        
        for p in input_paths:
            src_doc = fitz.Document(str(p))
            merged_doc.insert_pdf(src_doc)
            src_doc.close()
            
        merged_doc.save(str(output_path))
        merged_doc.close()
        
    except Exception as e:
        logger.error(f"PDF merge failed: {e}")
        raise RuntimeError(f"Failed to merge PDFs: {e}")

    return output_path

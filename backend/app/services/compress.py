"""
Compress PDF and Image files to reduce their size.
"""

import fitz  # PyMuPDF
from PIL import Image
import zipfile
import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def compress_pdf(input_path: Path, output_path: Path) -> Path:
    """
    Compresses a PDF file using PyMuPDF's built-in deflate and garbage collection.
    """
    try:
        doc = fitz.Document(str(input_path))
        # garbage=3: restructure, remove unreferenced objects, merge duplicate objects
        # deflate=True: deflate streams
        doc.save(str(output_path), garbage=3, deflate=True)
        doc.close()
    except Exception as e:
        logger.error(f"PDF compression failed: {e}")
        raise RuntimeError(f"Failed to compress PDF: {e}")

    return output_path

def compress_image(input_path: Path, output_path: Path) -> Path:
    """
    Compresses an image file and stores it in a zip archive.
    """
    try:
        img = Image.open(input_path)
        # Convert to RGB if necessary (e.g., for saving as JPEG instead of PNG)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        base_name = input_path.stem
        # We'll save it as a high-compression JPEG
        temp_img_name = f"{base_name}_compressed.jpg"
        temp_img_path = output_path.parent / temp_img_name

        img.save(temp_img_path, format="JPEG", quality=60, optimize=True)

        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(temp_img_path, temp_img_name)
            
        # Clean up
        os.remove(temp_img_path)

    except Exception as e:
        logger.error(f"Image compression failed: {e}")
        raise RuntimeError(f"Failed to compress Image: {e}")

    return output_path

"""
PDF → Word conversion service.
Uses pdf2docx library to convert PDF files to editable DOCX documents.
"""

import logging
from pathlib import Path
from pdf2docx import Converter

logger = logging.getLogger(__name__)


def convert_pdf_to_word(input_path: Path, output_path: Path) -> Path:
    """
    Convert a PDF file to Word (DOCX) format.

    Args:
        input_path: Path to the source PDF file
        output_path: Path where the DOCX file will be saved

    Returns:
        Path to the converted DOCX file

    Raises:
        ValueError: If input file doesn't exist or is not a PDF
        RuntimeError: If conversion fails
    """
    if not input_path.exists():
        raise ValueError(f"Input file not found: {input_path}")

    if input_path.suffix.lower() != ".pdf":
        raise ValueError(f"Expected PDF file, got: {input_path.suffix}")

    # Ensure output has .docx extension
    output_path = output_path.with_suffix(".docx")

    logger.info(f"Converting PDF → Word: {input_path.name} → {output_path.name}")

    try:
        cv = Converter(str(input_path))
        cv.convert(str(output_path))
        cv.close()
    except Exception as e:
        logger.error(f"PDF to Word conversion failed: {e}")
        raise RuntimeError(f"Conversion failed: {str(e)}") from e

    if not output_path.exists():
        raise RuntimeError("Conversion produced no output file")

    logger.info(f"Conversion complete: {output_path.name} ({output_path.stat().st_size} bytes)")
    return output_path

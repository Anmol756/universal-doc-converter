"""
Conversion orchestrator.
Routes conversion requests to the appropriate service handler.
"""

import logging
from pathlib import Path

from app.models import ConversionType
from app.services.pdf_to_word import convert_pdf_to_word
from app.services.word_to_pdf import convert_word_to_pdf
from app.services.image_to_pdf import convert_image_to_pdf
from app.services.pdf_to_ppt import convert_pdf_to_ppt
from app.services.ppt_to_pdf import convert_ppt_to_pdf
from app.services.pdf_to_excel import convert_pdf_to_excel
from app.services.excel_to_pdf import convert_excel_to_pdf
from app.services.pdf_merge import convert_pdf_merge
from app.services.pdf_split import convert_pdf_split
from app.services.compress import compress_pdf, compress_image

logger = logging.getLogger(__name__)

# Map conversion types to their handler functions
CONVERSION_HANDLERS = {
    ConversionType.PDF_TO_WORD: convert_pdf_to_word,
    ConversionType.WORD_TO_PDF: convert_word_to_pdf,
    ConversionType.IMAGE_TO_PDF: convert_image_to_pdf,
    ConversionType.PDF_TO_PPT: convert_pdf_to_ppt,
    ConversionType.PPT_TO_PDF: convert_ppt_to_pdf,
    ConversionType.PDF_TO_EXCEL: convert_pdf_to_excel,
    ConversionType.EXCEL_TO_PDF: convert_excel_to_pdf,
    ConversionType.PDF_MERGE: convert_pdf_merge,
    ConversionType.PDF_SPLIT: convert_pdf_split,
    ConversionType.COMPRESS_PDF: compress_pdf,
    ConversionType.COMPRESS_IMAGE: compress_image,
}

# Map conversion types to output extensions
OUTPUT_EXTENSIONS = {
    ConversionType.PDF_TO_WORD: ".docx",
    ConversionType.WORD_TO_PDF: ".pdf",
    ConversionType.IMAGE_TO_PDF: ".pdf",
    ConversionType.PDF_TO_PPT: ".pptx",
    ConversionType.PPT_TO_PDF: ".pdf",
    ConversionType.PDF_TO_EXCEL: ".xlsx",
    ConversionType.EXCEL_TO_PDF: ".pdf",
    ConversionType.PDF_MERGE: ".pdf",
    ConversionType.PDF_SPLIT: ".zip",
    ConversionType.COMPRESS_PDF: ".pdf",
    ConversionType.COMPRESS_IMAGE: ".zip",
}


def run_conversion(
    input_paths: list[Path],
    output_path: Path,
    conversion_type: ConversionType,
) -> Path:
    """
    Execute a file conversion by dispatching to the correct handler.

    Args:
        input_paths: Paths to the uploaded source files
        output_path: Path where the converted file will be saved
        conversion_type: The type of conversion to perform

    Returns:
        Path to the converted output file

    Raises:
        ValueError: If conversion type is not supported
        RuntimeError: If conversion fails
    """
    handler = CONVERSION_HANDLERS.get(conversion_type)

    if handler is None:
        raise ValueError(f"Unsupported conversion type: {conversion_type}")

    logger.info(
        f"Starting conversion: {conversion_type.value} | "
        f"Inputs: {[p.name for p in input_paths]} → Output dir: {output_path.parent}"
    )

    if conversion_type in (ConversionType.PDF_MERGE, ConversionType.IMAGE_TO_PDF):
        result = handler(input_paths, output_path)
    else:
        # Standard handlers take a single input
        result = handler(input_paths[0], output_path)

    logger.info(f"Conversion successful: {result.name}")
    return result

def get_output_extension(conversion_type: ConversionType) -> str:
    """Get the expected output file extension for a conversion type."""
    return OUTPUT_EXTENSIONS.get(conversion_type, "")

"""
Pydantic models for request/response validation.
"""

from enum import Enum
from pydantic import BaseModel, Field


class ConversionType(str, Enum):
    """Supported conversion types."""
    PDF_TO_WORD = "pdf_to_word"
    WORD_TO_PDF = "word_to_pdf"
    IMAGE_TO_PDF = "image_to_pdf"
    PDF_TO_PPT = "pdf_to_ppt"
    PPT_TO_PDF = "ppt_to_pdf"
    PDF_TO_EXCEL = "pdf_to_excel"
    EXCEL_TO_PDF = "excel_to_pdf"
    PDF_MERGE = "pdf_merge"
    PDF_SPLIT = "pdf_split"
    COMPRESS_PDF = "compress_pdf"
    COMPRESS_IMAGE = "compress_image"


# ── Response Models ─────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    """Returned after a successful file upload."""
    file_id: str = Field(..., description="Unique identifier for the uploaded file")
    original_name: str = Field(..., description="Original filename")
    file_size: int = Field(..., description="File size in bytes")
    file_type: str = Field(..., description="Detected file category (pdf, docx, image)")
    allowed_conversions: list[str] = Field(
        ..., description="List of conversion types available for this file"
    )


class ConvertRequest(BaseModel):
    """Request body for file conversion."""
    file_id: str | None = Field(None, description="ID of a single uploaded file to convert")
    file_ids: list[str] | None = Field(None, description="IDs of multiple uploaded files for bulk/merge operations")
    conversion_type: ConversionType = Field(..., description="Type of conversion")


class ConvertResponse(BaseModel):
    """Returned after a successful conversion."""
    file_id: str = Field(..., description="ID for downloading the converted file")
    original_name: str = Field(..., description="Original filename")
    output_name: str = Field(..., description="Converted filename")
    conversion_type: str = Field(..., description="Conversion type performed")
    download_url: str = Field(..., description="URL to download the converted file")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    version: str = "1.0.0"
    service: str = "Universal Document Converter"


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    error_code: str | None = None

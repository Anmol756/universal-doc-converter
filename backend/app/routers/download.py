"""
Download router — serves converted files for download.
"""

import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import OUTPUT_DIR
from app.utils.file_handler import find_file_by_id

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Download"])

# MIME type mapping for common output formats
CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".ppt": "application/vnd.ms-powerpoint",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}


@router.get("/download/{file_id}")
async def download_file(file_id: str):
    """
    Download a converted file by its ID.

    - Looks up the file in the outputs directory
    - Returns it as a downloadable attachment
    - Sets proper Content-Type and Content-Disposition headers
    """
    output_file = find_file_by_id(file_id, OUTPUT_DIR)

    if output_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found. It may have been cleaned up or not yet processed.",
        )

    # Determine content type
    ext = output_file.suffix.lower()
    content_type = CONTENT_TYPES.get(ext, "application/octet-stream")

    # Build a clean download filename (remove the UUID prefix)
    parts = output_file.stem.split("_", 1)
    clean_name = parts[1] if len(parts) > 1 else parts[0]
    download_name = f"{clean_name}{ext}"

    logger.info(f"Serving download: {output_file.name} as {download_name}")

    return FileResponse(
        path=str(output_file),
        media_type=content_type,
        filename=download_name,
        headers={
            "Content-Disposition": f'attachment; filename="{download_name}"'
        },
    )

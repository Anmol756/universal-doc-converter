"""
Upload router — handles file upload with validation and UUID naming.
"""

import logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import (
    UPLOAD_DIR,
    MAX_FILE_SIZE_BYTES,
    MAX_FILE_SIZE_MB,
    ALLOWED_EXTENSIONS,
    SUPPORTED_CONVERSIONS,
)
from app.models import UploadResponse
from app.utils.file_handler import (
    generate_file_id,
    get_unique_filename,
    save_upload_file,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file for conversion.

    - Validates file extension and size
    - Saves with UUID-based unique filename
    - Returns file ID and allowed conversions
    """
    # ── Validate file extension ──────────────────────────────────────
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    file_category = ALLOWED_EXTENSIONS.get(ext)

    if file_category is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. "
            f"Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS.keys()))}",
        )

    # ── Generate unique ID and save ──────────────────────────────────
    file_id = generate_file_id()
    unique_name = get_unique_filename(file.filename, file_id)
    save_path = UPLOAD_DIR / unique_name

    try:
        file_size = await save_upload_file(file, save_path)
    except Exception as e:
        logger.error(f"Failed to save uploaded file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save file")
    finally:
        await file.close()

    # ── Validate file size (after saving for accuracy) ───────────────
    if file_size > MAX_FILE_SIZE_BYTES:
        save_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({file_size / 1024 / 1024:.1f} MB). "
            f"Maximum allowed: {MAX_FILE_SIZE_MB} MB",
        )

    # ── Determine allowed conversions ────────────────────────────────
    allowed_conversions = [
        conv_type
        for conv_type, spec in SUPPORTED_CONVERSIONS.items()
        if file_category in spec["input"]
    ]

    logger.info(
        f"Uploaded: {file.filename} → {unique_name} "
        f"({file_size} bytes, type={file_category})"
    )

    return UploadResponse(
        file_id=file_id,
        original_name=file.filename,
        file_size=file_size,
        file_type=file_category,
        allowed_conversions=allowed_conversions,
    )

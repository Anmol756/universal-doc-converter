"""
Convert router — handles file conversion requests.
Runs CPU-intensive conversions in a thread pool to avoid blocking the event loop.
"""

import asyncio
import logging
from pathlib import Path
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, HTTPException

from app.config import UPLOAD_DIR, OUTPUT_DIR, SUPPORTED_CONVERSIONS, ALLOWED_EXTENSIONS
from app.models import ConvertRequest, ConvertResponse, ConversionType
from app.services.converter import run_conversion, get_output_extension
from app.utils.file_handler import find_file_by_id, generate_file_id

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Convert"])

# Shared thread pool for CPU-bound conversions (avoids per-request thread creation overhead)
_conversion_pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix="converter")


@router.post("/convert", response_model=ConvertResponse)
async def convert_file(request: ConvertRequest):
    """
    Convert an uploaded file or files to the requested format.

    - Validates the files exist and conversion type is compatible
    - Runs conversion in a thread pool (non-blocking)
    - Returns download URL for the converted file
    """
    if not request.file_id and not request.file_ids:
        raise HTTPException(status_code=400, detail="Must provide file_id or file_ids")

    # ── Gather input files ──────────────────────────────────────────
    target_ids = request.file_ids if request.file_ids else [request.file_id]
    input_paths = []

    for fid in target_ids:
        if not fid:
            continue
        path = find_file_by_id(fid, UPLOAD_DIR)
        if not path:
            raise HTTPException(
                status_code=404,
                detail=f"File {fid} not found. It may have been cleaned up.",
            )
        input_paths.append(path)

    if not input_paths:
        raise HTTPException(status_code=400, detail="No valid files provided")

    # ── Validate conversion compatibility ────────────────────────────
    conversion_spec = SUPPORTED_CONVERSIONS.get(request.conversion_type.value)
    if conversion_spec is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown conversion type: {request.conversion_type}",
        )

    for in_path in input_paths:
        ext = in_path.suffix.lower()
        file_category = ALLOWED_EXTENSIONS.get(ext)
        if file_category not in conversion_spec["input"]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot perform {request.conversion_type.value} on a "
                f"{file_category} file. Expected: {conversion_spec['input']}",
            )

    # ── Prepare output path ──────────────────────────────────────────
    output_id = generate_file_id()
    output_ext = get_output_extension(request.conversion_type)
    
    if len(input_paths) == 1:
        original_stem = Path(input_paths[0].name).stem
        # Remove the input file_id prefix to get the clean original name
        clean_stem = "_".join(original_stem.split("_")[1:]) if "_" in original_stem else original_stem
        output_filename = f"{output_id}_{clean_stem}{output_ext}"
        original_name = input_paths[0].name
    else:
        output_filename = f"{output_id}_merged{output_ext}"
        original_name = f"Multiple files ({len(input_paths)})"

    output_path = OUTPUT_DIR / output_filename

    # ── Run conversion in thread pool ────────────────────────────────
    try:
        loop = asyncio.get_event_loop()
        result_path = await loop.run_in_executor(
            _conversion_pool,
            partial(
                run_conversion,
                input_paths=input_paths,
                output_path=output_path,
                conversion_type=request.conversion_type,
            ),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected conversion error: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during conversion",
        )

    logger.info(f"Conversion complete: {original_name} → {result_path.name}")

    return ConvertResponse(
        file_id=output_id,
        original_name=original_name,
        output_name=result_path.name,
        conversion_type=request.conversion_type.value,
        download_url=f"/api/download/{output_id}",
    )

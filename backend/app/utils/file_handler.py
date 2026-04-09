"""
File handling utilities: UUID naming, chunked saving, and cleanup.
"""

import os
import uuid
import time
import asyncio
import logging
from pathlib import Path

import aiofiles

from app.config import UPLOAD_DIR, OUTPUT_DIR, FILE_TTL_MINUTES

logger = logging.getLogger(__name__)

CHUNK_SIZE = 1024 * 1024  # 1 MB


def generate_file_id() -> str:
    """Generate a unique file identifier."""
    return str(uuid.uuid4())


def get_unique_filename(original_name: str, file_id: str) -> str:
    """
    Create a unique filename preserving the original extension.
    Format: {uuid}_{original_stem}{ext}
    """
    stem = Path(original_name).stem
    ext = Path(original_name).suffix.lower()
    # Sanitize the stem (remove special chars, keep only alphanum and underscores)
    safe_stem = "".join(c if c.isalnum() or c == "_" else "_" for c in stem)
    return f"{file_id}_{safe_stem}{ext}"


async def save_upload_file(upload_file, destination: Path) -> int:
    """
    Stream an uploaded file to disk in chunks.
    Returns the total file size in bytes.
    """
    total_size = 0
    async with aiofiles.open(destination, "wb") as out_file:
        while True:
            chunk = await upload_file.read(CHUNK_SIZE)
            if not chunk:
                break
            total_size += len(chunk)
            await out_file.write(chunk)
    return total_size


def get_upload_path(filename: str) -> Path:
    """Get full path for an uploaded file."""
    return UPLOAD_DIR / filename


def get_output_path(filename: str) -> Path:
    """Get full path for a converted output file."""
    return OUTPUT_DIR / filename


def find_file_by_id(file_id: str, directory: Path) -> Path | None:
    """
    Find a file in the given directory that starts with the file_id.
    Returns the full path or None.
    """
    for file_path in directory.iterdir():
        if file_path.is_file() and file_path.name.startswith(file_id):
            return file_path
    return None


def cleanup_old_files(directory: Path, ttl_minutes: int = FILE_TTL_MINUTES) -> int:
    """
    Delete files older than `ttl_minutes` from the given directory.
    Returns the number of files deleted.
    """
    count = 0
    now = time.time()
    cutoff = now - (ttl_minutes * 60)

    if not directory.exists():
        return 0

    for file_path in directory.iterdir():
        if file_path.is_file():
            try:
                if file_path.stat().st_mtime < cutoff:
                    file_path.unlink()
                    count += 1
                    logger.info(f"Cleaned up: {file_path.name}")
            except OSError as e:
                logger.warning(f"Failed to delete {file_path.name}: {e}")

    return count


async def periodic_cleanup(interval_minutes: int):
    """
    Background task that periodically cleans up old files.
    Runs as a long-lived asyncio task.
    """
    while True:
        await asyncio.sleep(interval_minutes * 60)
        try:
            uploads_deleted = cleanup_old_files(UPLOAD_DIR)
            outputs_deleted = cleanup_old_files(OUTPUT_DIR)
            logger.info(
                f"Periodic cleanup: removed {uploads_deleted} uploads, "
                f"{outputs_deleted} outputs"
            )
        except Exception as e:
            logger.error(f"Cleanup error: {e}")


def delete_file(file_path: Path) -> bool:
    """Safely delete a single file."""
    try:
        if file_path.exists():
            file_path.unlink()
            return True
    except OSError as e:
        logger.warning(f"Failed to delete {file_path}: {e}")
    return False

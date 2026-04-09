"""
Application configuration.
Uses environment variables with sensible defaults for local development.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ── Base Paths ──────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
UPLOAD_DIR = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")
OUTPUT_DIR = BASE_DIR / os.getenv("OUTPUT_DIR", "outputs")

# ── Server ──────────────────────────────────────────────────────────────
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# ── CORS ────────────────────────────────────────────────────────────────
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000"
).split(",")

# ── File Constraints ───────────────────────────────────────────────────
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 10))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# ── Allowed MIME Types (mapped to category) ────────────────────────────
ALLOWED_MIME_TYPES = {
    # PDF
    "application/pdf": "pdf",
    # Word
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
    # PowerPoint
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-powerpoint": "ppt",
    # Excel
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xls",
    # Images
    "image/jpeg": "image",
    "image/png": "image",
    "image/bmp": "image",
    "image/webp": "image",
    "image/tiff": "image",
}

ALLOWED_EXTENSIONS = {
    ".pdf": "pdf",
    ".docx": "docx",
    ".doc": "doc",
    ".pptx": "pptx",
    ".ppt": "ppt",
    ".xlsx": "xlsx",
    ".xls": "xls",
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".bmp": "image",
    ".webp": "image",
    ".tiff": "image",
    ".tif": "image",
}

# ── Supported Conversions ──────────────────────────────────────────────
SUPPORTED_CONVERSIONS = {
    "pdf_to_word": {"input": ["pdf"], "output": "docx"},
    "word_to_pdf": {"input": ["docx", "doc"], "output": "pdf"},
    "image_to_pdf": {"input": ["image"], "output": "pdf"},
    "pdf_to_ppt": {"input": ["pdf"], "output": "pptx"},
    "ppt_to_pdf": {"input": ["pptx", "ppt"], "output": "pdf"},
    "pdf_to_excel": {"input": ["pdf"], "output": "xlsx"},
    "excel_to_pdf": {"input": ["xlsx", "xls"], "output": "pdf"},
    "pdf_merge": {"input": ["pdf"], "output": "pdf"},
    "pdf_split": {"input": ["pdf"], "output": "zip"},
    "compress_pdf": {"input": ["pdf"], "output": "pdf"},
    "compress_image": {"input": ["image"], "output": "zip"},
}

# ── Cleanup ─────────────────────────────────────────────────────────────
CLEANUP_INTERVAL_MINUTES = int(os.getenv("CLEANUP_INTERVAL_MINUTES", 30))
FILE_TTL_MINUTES = int(os.getenv("FILE_TTL_MINUTES", 60))

# ── Storage Mode ────────────────────────────────────────────────────────
STORAGE_MODE = os.getenv("STORAGE_MODE", "local")  # "local" | "s3"

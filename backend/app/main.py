"""
Universal Document Converter — FastAPI Application Entry Point.

Sets up the application, CORS, routes, and background cleanup task.
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.config import CORS_ORIGINS, UPLOAD_DIR, OUTPUT_DIR, CLEANUP_INTERVAL_MINUTES
from app.models import HealthResponse
from app.routers import upload, convert, download
from app.utils.file_handler import periodic_cleanup

# ── Logging ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-7s │ %(name)s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ───────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager — creates directories and starts cleanup."""
    # Startup
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    logger.info(f"📁 Upload directory: {UPLOAD_DIR}")
    logger.info(f"📁 Output directory: {OUTPUT_DIR}")

    # Start background cleanup task
    cleanup_task = asyncio.create_task(periodic_cleanup(CLEANUP_INTERVAL_MINUTES))
    logger.info(f"🧹 Auto-cleanup enabled (every {CLEANUP_INTERVAL_MINUTES} min)")

    logger.info("🚀 Universal Document Converter is ready!")
    yield

    # Shutdown
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass
    logger.info("👋 Shutting down gracefully")


# ── Create App ──────────────────────────────────────────────────────────
app = FastAPI(
    title="Universal Document Converter",
    description="Convert files between PDF, Word, and Image formats",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS Middleware ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ───────────────────────────────────────────────────
app.include_router(upload.router, prefix="/api")
app.include_router(convert.router, prefix="/api")
app.include_router(download.router, prefix="/api")

# ── Static Frontend ─────────────────────────────────────────────────────
# We serve the frontend AFTER api routes so that /api takes precedence
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
else:
    logger.warning(f"Frontend dist not found at {FRONTEND_DIST}. Serving API only.")


# ── Health Check ────────────────────────────────────────────────────────
@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return HealthResponse()


# ── Global Exception Handler ───────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unhandled exceptions."""
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred. Please try again.",
            "error_code": "INTERNAL_ERROR",
        },
    )

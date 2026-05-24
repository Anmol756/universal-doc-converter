# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies first for better caching
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY frontend/ .
RUN npm run build


# ==========================================
# Stage 2: Build the FastAPI Backend
# ==========================================
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required by Python PDF/Doc libraries and LibreOffice for Linux conversions
# We install metric-compatible fonts (Carlito for Calibri, Caladea for Cambria, Liberation for Arial/Times) 
# to perfectly preserve Word layouts without needing Microsoft's proprietary EULA fonts.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libjpeg-dev \
    zlib1g-dev \
    fontconfig \
    libreoffice \
    libreoffice-writer \
    fonts-liberation \
    fonts-crosextra-carlito \
    fonts-crosextra-caladea \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -f -v
# Install Python dependencies
COPY backend/requirements.txt ./backend/
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend/ .

# Copy the built frontend static files from Stage 1
# This perfectly maps to the FRONTEND_DIST relative path we added in main.py
# (../../frontend/dist relative to backend/app/main.py)
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose the port (Render injects $PORT=10000, locally falls back to 8000)
EXPOSE 10000

# Start the application — respects $PORT if set by the hosting platform
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

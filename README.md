# Universal Document Converter

A production-ready full-stack web platform for converting documents between PDF, Word, and Image formats.

**Frontend:** React (Vite) · **Backend:** FastAPI (Python) · **Storage:** Local filesystem (S3-ready)

---

## ✨ Features

- **PDF → Word** — Convert PDF to editable DOCX
- **Word → PDF** — Convert DOCX to PDF format  
- **Image → PDF** — Convert JPG/PNG/BMP/WebP/TIFF to PDF
- **Drag & Drop** upload with real-time progress
- **Auto-cleanup** — files are automatically deleted after 1 hour
- **UUID-based** unique file naming (no collisions)
- **Responsive UI** — works on desktop and mobile
- **Dark glassmorphism** design with smooth animations

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+** and **pip**
- **Node.js 18+** and **npm**

### 1. Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

### 2. Frontend (React + Vite)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The UI will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
universal-doc-converter/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── config.py        # Settings & constants
│   │   ├── models.py        # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   │   ├── upload.py    # POST /api/upload
│   │   │   ├── convert.py   # POST /api/convert
│   │   │   └── download.py  # GET /api/download/{id}
│   │   ├── services/        # Conversion logic
│   │   │   ├── converter.py # Orchestrator
│   │   │   ├── pdf_to_word.py
│   │   │   ├── word_to_pdf.py
│   │   │   └── image_to_pdf.py
│   │   └── utils/           # Helpers
│   │       ├── file_handler.py
│   │       └── storage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API layer
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Upload a file (multipart/form-data) |
| `POST` | `/api/convert` | Convert an uploaded file |
| `GET` | `/api/download/{file_id}` | Download a converted file |

---

## 🚢 Deployment

### Backend → Render / Railway

1. Push code to GitHub
2. Connect repo on [Render](https://render.com) or [Railway](https://railway.app)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set env vars: `CORS_ORIGINS=https://your-frontend.vercel.app`

### Frontend → Vercel

1. Connect GitHub repo on [Vercel](https://vercel.com)
2. Framework preset: Vite
3. Set env var: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

---

## 🔮 Advanced Features (Roadmap)

1. **🤖 AI-Powered OCR** — Use Tesseract OCR to extract text from scanned PDFs/images
2. **🧠 AI Document Summarization** — Integrate OpenAI/Gemini for auto-summarization
3. **📊 Batch Conversion** — Upload multiple files and download as ZIP

---

## 📝 License

MIT

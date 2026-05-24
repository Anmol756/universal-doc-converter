# Universal Document Converter — Deployment Guide

This guide covers deployment instructions for various environments. Since this application relies on LibreOffice Headless for high-fidelity document conversion, **LibreOffice must be installed on the host machine or container**.

---

## 1. Local Windows Setup

### Prerequisites
1. **Python 3.10+**: Download and install from python.org. Ensure it's added to your PATH.
2. **Node.js 18+**: Download and install from nodejs.org.
3. **LibreOffice**: Download and install from libreoffice.org. Ensure `soffice.exe` or `libreoffice.exe` is added to your system PATH.

### Backend Setup
1. Open PowerShell and navigate to the backend folder:
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Run the FastAPI server:
   ```powershell
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### Frontend Setup
1. Open a new PowerShell window and navigate to the frontend folder:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Access the app at `http://localhost:5173`.

---

## 2. Local Ubuntu / VPS Deployment (Systemd + Nginx)

### Prerequisites
Install dependencies and LibreOffice on your VPS (Ubuntu 22.04+):
```bash
sudo apt update
sudo apt install -y python3-pip python3-venv nodejs npm nginx libreoffice
```

### Backend Setup (Systemd Service)
1. Setup virtual environment:
   ```bash
   cd /path/to/universal-doc-converter/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Create a systemd service file:
   ```bash
   sudo nano /etc/systemd/system/docconverter.service
   ```
3. Add the following (adjust paths):
   ```ini
   [Unit]
   Description=Gunicorn instance to serve Universal Document Converter
   After=network.target

   [Service]
   User=ubuntu
   Group=www-data
   WorkingDirectory=/path/to/universal-doc-converter/backend
   Environment="PATH=/path/to/universal-doc-converter/backend/venv/bin"
   ExecStart=/path/to/universal-doc-converter/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000

   [Install]
   WantedBy=multi-user.target
   ```
4. Start and enable the service:
   ```bash
   sudo systemctl start docconverter
   sudo systemctl enable docconverter
   ```

### Frontend Setup (Build & Nginx)
1. Build the frontend:
   ```bash
   cd /path/to/universal-doc-converter/frontend
   npm install
   npm run build
   ```
2. Copy the `dist` folder contents to `/var/www/html` or point Nginx to the `dist` folder.
3. Configure Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
4. Example Nginx Config:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           root /path/to/universal-doc-converter/frontend/dist;
           try_files $uri /index.html;
       }

       location /api/ {
           proxy_pass http://127.0.0.1:8000/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
5. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

---

## 3. Docker Deployment (Recommended)

Docker is the best way to deploy this application because it encapsulates the LibreOffice dependency, preventing environmental issues across different operating systems.

### `Dockerfile`
Create a `Dockerfile` in the root of the `backend` folder:

```dockerfile
FROM python:3.11-slim

# Install LibreOffice and fonts
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-liberation \
    fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run
```bash
cd backend
docker build -t universal-doc-converter .
docker run -d -p 8000:8000 --name doc-converter universal-doc-converter
```

---

## 4. Render Deployment

Render natively supports Docker, which makes deploying this application extremely simple. You cannot use a standard Python environment on Render because it lacks LibreOffice.

1. Go to **Render Dashboard** -> **New Web Service**.
2. Connect your GitHub repository.
3. For the **Environment**, select **Docker** (not Python).
4. Render will automatically detect the `Dockerfile` in your repository and build the image.
5. In the settings, ensure you set the **Build Context Directory** to `backend` if your `Dockerfile` is inside the `backend` folder.
6. Click **Create Web Service**. 
7. Once deployed, update your frontend's `VITE_API_URL` environment variable to point to your new Render backend URL.

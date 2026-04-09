/**
 * API service layer for the Universal Document Converter.
 * Handles all HTTP communication with the FastAPI backend.
 */

import axios from 'axios';

// ── Axios Instance ──────────────────────────────────────────────────
// In development, use empty string so requests go through Vite's proxy
// In production, set VITE_API_URL to the deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 120000, // 2 min timeout for large file conversions
});

// ── Request/Response Interceptors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.message ||
      'An unexpected error occurred';

    console.error('[API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message,
    });

    return Promise.reject({ message, status: error.response?.status });
  }
);

// ── API Functions ───────────────────────────────────────────────────

/**
 * Upload a file to the server.
 * @param {File} file - The file to upload
 * @param {function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<object>} Upload response with file_id and metadata
 */
export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    },
  });

  return response.data;
}

export async function convertFile(fileIdOrIds, conversionType) {
  const payload = {
    conversion_type: conversionType,
  };
  
  if (Array.isArray(fileIdOrIds)) {
      payload.file_ids = fileIdOrIds;
  } else {
      payload.file_id = fileIdOrIds;
  }

  const response = await api.post('/convert', payload);

  return response.data;
}

/**
 * Build the full download URL for a converted file.
 * @param {string} fileId - ID of the converted output file
 * @returns {string} Full download URL
 */
export function getDownloadUrl(fileId) {
  return `${API_BASE_URL}/api/download/${fileId}`;
}

/**
 * Check if the backend is healthy.
 * @returns {Promise<object>} Health status
 */
export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export default api;

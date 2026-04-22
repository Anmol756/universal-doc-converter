import { useCallback, useRef, useState } from 'react';
import './FileUpload.css';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/webp',
  'image/tiff',
];

const ALLOWED_EXTENSIONS = '.pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.jpg,.jpeg,.png,.bmp,.webp,.tiff,.tif';

function FileUpload({ onFileSelect, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'No file selected';
    if (file.size > MAX_SIZE) return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: 10 MB`;
    // Check by extension as a fallback (MIME types can be unreliable)
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const validExtensions = ALLOWED_EXTENSIONS.split(',');
    if (!validExtensions.includes(ext)) {
      return `Unsupported file type: ${ext}`;
    }
    return null;
  };

  const handleFiles = useCallback((selectedFiles) => {
    setDragError('');
    const validFiles = [];
    const errors = [];

    const fileArray = Array.from(selectedFiles);

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setDragError(errors[0] + (errors.length > 1 ? ` (and ${errors.length - 1} more errors)` : ''));
    }

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files?.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const handleInputChange = (e) => {
    if (e.target.files?.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = ''; // Reset so same file can be re-selected
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="file-upload-wrapper animate-fade-in" id="file-upload-zone">
      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload file drop zone"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS}
          onChange={handleInputChange}
          className="sr-only"
          id="file-input"
          disabled={disabled}
          multiple={true}
        />

        <div className="upload-icon-wrapper">
          <div className="upload-icon-bg"></div>
          <svg className="upload-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 32V12" stroke="url(#uploadGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 20l8-8 8 8" stroke="url(#uploadGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 32a8 8 0 008 8h16a8 8 0 000-16 10 10 0 00-20 4 6 6 0 00-4 4z" stroke="url(#uploadGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            <defs>
              <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="upload-text">
          <p className="upload-title">
            {isDragging ? 'Drop your file(s) here!' : 'Drag & drop your file(s) here'}
          </p>
          <p className="upload-subtitle">
            or <span className="upload-browse">browse</span> to choose files
          </p>
        </div>

        <div className="upload-hints">
          <span className="upload-hint">PDF</span>
          <span className="upload-hint">DOCX</span>
          <span className="upload-hint">PPTX</span>
          <span className="upload-hint">XLSX</span>
          <span className="upload-hint">JPG</span>
          <span className="upload-hint">PNG</span>
          <span className="upload-hint-sep">•</span>
          <span className="upload-hint-size">Max 10 MB</span>
        </div>
      </div>

      {dragError && (
        <div className="upload-error animate-fade-in" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M8 5v3M8 10.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {dragError}
        </div>
      )}
    </div>
  );
}

export default FileUpload;

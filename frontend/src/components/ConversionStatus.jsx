import { STATUS } from '../hooks/useConverter';
import './ConversionStatus.css';

const STEPS = [
  { key: 'upload', label: 'Upload', icon: '⬆️' },
  { key: 'convert', label: 'Convert', icon: '⚙️' },
  { key: 'download', label: 'Download', icon: '⬇️' },
];

function getActiveStep(status) {
  switch (status) {
    case STATUS.UPLOADING: return 0;
    case STATUS.UPLOADED: return 1;
    case STATUS.CONVERTING: return 1;
    case STATUS.DONE: return 2;
    default: return -1;
  }
}

function ConversionStatus({ status, uploadProgress, error, downloadUrl, onDownload, onConvert, onReset, conversionType }) {
  const activeStep = getActiveStep(status);

  return (
    <div className="conversion-status" id="conversion-status">
      {/* Step Pipeline */}
      {status !== STATUS.IDLE && (
        <div className="status-pipeline animate-fade-in">
          {STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep || status === STATUS.DONE;
            const isFuture = index > activeStep && status !== STATUS.DONE;

            return (
              <div key={step.key} className="pipeline-item">
                <div className={`pipeline-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''} ${isFuture ? 'future' : ''}`}>
                  {isComplete ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : isActive && (status === STATUS.UPLOADING || status === STATUS.CONVERTING) ? (
                    <div className="pipeline-spinner"></div>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                <span className={`pipeline-label ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                  {step.label}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`pipeline-connector ${isComplete ? 'complete' : ''}`}></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Progress Bar */}
      {status === STATUS.UPLOADING && (
        <div className="progress-section animate-fade-in">
          <div className="progress-header">
            <span className="progress-label">Uploading...</span>
            <span className="progress-value">{uploadProgress}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Converting Spinner */}
      {status === STATUS.CONVERTING && (
        <div className="converting-section animate-fade-in">
          <div className="converting-spinner">
            <div className="spinner-ring"></div>
            <span className="spinner-icon">⚙️</span>
          </div>
          <p className="converting-text">Converting your file...</p>
          <p className="converting-subtext">This may take a few seconds</p>
        </div>
      )}

      {/* Action Buttons */}
      {status === STATUS.UPLOADED && conversionType && (
        <div className="action-buttons animate-slide-up">
          <button className="btn btn-primary btn-convert" onClick={onConvert} id="convert-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Convert Now
          </button>
        </div>
      )}

      {/* Success — Download */}
      {status === STATUS.DONE && downloadUrl && (
        <div className="success-section animate-result">
          <div className="success-icon-wrapper">
            <div className="success-icon-ring"></div>
            <span className="success-icon">✅</span>
          </div>
          <p className="success-text">Conversion Complete!</p>
          <div className="success-actions">
            <a
              href={downloadUrl}
              className="btn btn-success btn-download"
              download
              id="download-btn"
              onClick={onDownload}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v9M5 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Download File
            </a>
            <button className="btn btn-secondary" onClick={onReset} id="reset-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8a6 6 0 1111.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 2v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {status === STATUS.ERROR && error && (
        <div className="error-section animate-fade-in">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div>
              <p className="error-text">{error}</p>
              <button className="btn btn-secondary error-retry" onClick={onReset}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversionStatus;

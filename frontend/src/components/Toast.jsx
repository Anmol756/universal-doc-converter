import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import './Toast.css';

/* ── Toast Context ─────────────────────────────────────────────────── */
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = 'success', duration = 3500, icon } = {}) => {
    const id = ++toastIdCounter;
    const defaultIcons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️',
    };
    setToasts((prev) => [
      ...prev,
      { id, message, type, icon: icon || defaultIcons[type] || '✅', exiting: false },
    ]);

    // Auto-dismiss
    setTimeout(() => dismissToast(id), duration);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    // Mark as exiting first (triggers exit animation)
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove from DOM after exit animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

/* ── Toast Container ───────────────────────────────────────────────── */
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ── Toast Item ────────────────────────────────────────────────────── */
function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`toast-item toast-${toast.type} ${visible && !toast.exiting ? 'toast-enter' : ''} ${toast.exiting ? 'toast-exit' : ''}`}
      role="alert"
    >
      <span className="toast-icon">{toast.icon}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="toast-progress">
        <div className={`toast-progress-bar toast-progress-${toast.type}`} />
      </div>
    </div>
  );
}

export default ToastProvider;

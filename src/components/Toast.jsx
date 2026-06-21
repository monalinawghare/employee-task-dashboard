import { useTasks } from '../context/TaskContext';
import './Toast.css';

const ICONS = {
  success: '✓',
  error: '!',
  info: 'i',
};

/**
 * Renders the active toast queue from TaskContext.
 * Mounted once near the root of the app (see App.jsx).
 */
function ToastContainer() {
  const { toasts, dismissToast } = useTasks();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

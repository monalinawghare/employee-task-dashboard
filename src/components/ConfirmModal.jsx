import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * ConfirmModal
 * A small, reusable confirmation dialog. Used by TaskCard for delete
 * confirmation, but generic enough to reuse anywhere a "are you sure?"
 * prompt is needed.
 *
 * Closes on:
 *  - clicking the overlay
 *  - pressing Escape
 *  - clicking Cancel
 */
function ConfirmModal({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  // Allow closing with the Escape key for keyboard users.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        // Stop the overlay's onClick from firing when clicking inside the card.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h3 id="confirm-modal-title">{title}</h3>
        <p id="confirm-modal-message">{message}</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger-solid" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ConfirmModal;

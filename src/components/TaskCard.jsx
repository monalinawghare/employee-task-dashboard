import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

/**
 * Formats an ISO date string (YYYY-MM-DD) into a short readable label,
 * e.g. "Jun 24, 2026". Falls back gracefully if the date is invalid.
 */
function formatDate(dateStr) {
  if (!dateStr) return 'No due date';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dateStr}T00:00:00`);
  return due < today;
}

const PRIORITY_CLASS = {
  High: 'badge-priority-high',
  Medium: 'badge-priority-medium',
  Low: 'badge-priority-low',
};

/**
 * TaskCard
 * Renders a single task as a card with priority/status badges and
 * Edit / Delete / Complete actions. Also acts as a draggable item so
 * the parent TaskList can support drag-and-drop reordering.
 */
function TaskCard({
  task,
  onDelete,
  onToggleComplete,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
}) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const overdue = isOverdue(task.dueDate, task.status);

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  return (
    <article
      className={[
        'task-card',
        task.status === 'Completed' ? 'is-completed' : '',
        isDragging ? 'dragging' : '',
        isDragOver ? 'drag-over' : '',
      ].filter(Boolean).join(' ')}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragOver={(e) => onDragOver?.(e, task.id)}
      onDrop={(e) => onDrop?.(e, task.id)}
      onDragEnd={onDragEnd}
      data-testid={`task-card-${task.id}`}
    >
      <div className="task-card-top">
        <div className="task-card-badges">
          <span className={`badge ${PRIORITY_CLASS[task.priority] || 'badge-priority-low'}`}>
            <span className="badge-dot" />
            {task.priority}
          </span>
          <span
            className={`badge ${
              task.status === 'Completed' ? 'badge-status-completed' : 'badge-status-pending'
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      <h3 className="task-card-title">{task.title}</h3>
      <p className="task-card-description">{task.description}</p>

      <div className="task-card-footer">
        <span className={`task-card-due${overdue ? ' overdue' : ''}`}>
          📅 {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
        </span>

        <div className="task-card-actions">
          <button
            type="button"
            className={`action-complete${task.status === 'Completed' ? ' is-done' : ''}`}
            onClick={() => onToggleComplete(task.id)}
            title={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
            aria-label={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'Completed' ? '↺' : '✓'}
          </button>
          <button
            type="button"
            className="action-edit"
            onClick={() => navigate(`/edit-task/${task.id}`)}
            title="Edit task"
            aria-label="Edit task"
          >
            ✎
          </button>
          <button
            type="button"
            className="action-delete"
            onClick={() => setShowDeleteModal(true)}
            title="Delete task"
            aria-label="Delete task"
          >
            {/* Trash icon - plain SVG with currentColor so it always
                matches the theme, unlike emoji glyphs which render as
                fixed full-color pictograms on some platforms. */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete this task?"
          message={
            <>This will permanently delete <strong>`{task.title}`</strong>. This action cannot be undone.</>
          }
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </article>
  );
}
export default TaskCard;

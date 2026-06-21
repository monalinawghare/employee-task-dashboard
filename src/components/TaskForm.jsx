import { useState } from 'react';

const PRIORITIES = ['High', 'Medium', 'Low'];

/** Returns today's date as YYYY-MM-DD, used as the min attribute for the date picker. */
function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Validates the form fields and returns an object of field -> error message.
 * An empty object means the form is valid.
 */
function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Task title is required.';
  } else if (values.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.';
  } else if (values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  if (!values.priority) {
    errors.priority = 'Please select a priority.';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  }

  return errors;
}

/**
 * TaskForm
 * Shared, fully-controlled form used by both the "Add Task" and "Edit Task"
 * pages. Validates required fields client-side and blocks submission while
 * any field is invalid.
 *
 * Props:
 *  - initialValues: pre-fill values (used when editing)
 *  - onSubmit(values): called with sanitized values on a valid submit
 *  - submitLabel: text for the submit button
 *  - onCancel: optional cancel handler
 */
function TaskForm({ initialValues, onSubmit, submitLabel = 'Save Task', onCancel }) {
  const [values, setValues] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    priority: initialValues?.priority || 'Medium',
    dueDate: initialValues?.dueDate || '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Live-clear an error as soon as the field becomes valid again.
    if (touched[field]) {
      const fieldErrors = validate({ ...values, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(values);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setTouched({ title: true, description: true, priority: true, dueDate: true });

    if (Object.keys(fieldErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          className={`form-control${errors.title ? ' has-error' : ''}`}
          placeholder="e.g. Prepare weekly status report"
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          maxLength={100}
        />
        {errors.title && <span className="form-error-message">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className={`form-control${errors.description ? ' has-error' : ''}`}
          placeholder="Add details about what needs to be done..."
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          maxLength={500}
        />
        <div className="char-count">{values.description.length}/500</div>
        {errors.description && (
          <span className="form-error-message">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        {/* Priority */}
        <div className="form-group">
          <label className="form-label" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            className={`form-control${errors.priority ? ' has-error' : ''}`}
            value={values.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            onBlur={() => handleBlur('priority')}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.priority && <span className="form-error-message">{errors.priority}</span>}
        </div>

        {/* Due date */}
        <div className="form-group">
          <label className="form-label" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            className={`form-control${errors.dueDate ? ' has-error' : ''}`}
            value={values.dueDate}
            min={getTodayISO()}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            onBlur={() => handleBlur('dueDate')}
          />
          {errors.dueDate && <span className="form-error-message">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;

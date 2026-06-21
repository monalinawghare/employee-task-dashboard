import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import '../styles/form.css';

/**
 * EditTask
 * The "/edit-task/:id" page. Loads the existing task by id from context,
 * pre-fills the shared TaskForm, and saves updates back via updateTask.
 * Gracefully handles a missing/invalid id (e.g. stale link, deleted task).
 */
function EditTask() {
  const { id } = useParams();
  const { getTaskById, updateTask } = useTasks();
  const navigate = useNavigate();

  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="page-shell">
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3>Task not found</h3>
          <p>This task may have already been deleted, or the link is invalid.</p>
          <Link to="/tasks" className="btn btn-primary" style={{ marginTop: 16 }}>
            Back to Task List
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (values) => {
    updateTask(task.id, values);
    navigate('/tasks');
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Edit Task</h1>
          <p className="page-subtitle">Update the details for "{task.title}".</p>
        </div>
      </div>

      <TaskForm
        initialValues={task}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        onCancel={() => navigate('/tasks')}
      />
    </div>
  );
}

export default EditTask;

import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import '../styles/form.css';

/**
 * AddTask
 * The "/add-task" page. Renders the shared TaskForm and creates a new
 * task on valid submit, then redirects to the Task List.
 */
function AddTask() {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    addTask(values);
    navigate('/tasks');
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Add Task</h1>
          <p className="page-subtitle">Fill in the details below to create a new task.</p>
        </div>
      </div>

      <div className="page-body">
        <TaskForm
          onSubmit={handleSubmit}
          submitLabel="Add Task"
          onCancel={() => navigate('/tasks')}
        />
      </div>
    </div>
  );
}

export default AddTask;

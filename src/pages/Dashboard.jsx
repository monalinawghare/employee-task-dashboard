import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import '../styles/dashboard.css';

/**
 * Dashboard
 * Landing page ("/") showing summary statistics and a quick overview
 * of progress + upcoming due tasks.
 */
function Dashboard() {
  const { tasks, stats } = useTasks();

  const completionRate = stats.total === 0
    ? 0
    : Math.round((stats.completed / stats.total) * 100);

  // Upcoming pending tasks, soonest due date first, capped to 5.
  const upcoming = tasks
    .filter((t) => t.status === 'Pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">A quick overview of your team&apos;s task load.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          + Add Task
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--total">
          <div className="stat-card-top">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-icon">�</span>
          </div>
          <span className="stat-value">{stats.total}</span>
        </div>

        <div className="stat-card stat-card--completed">
          <div className="stat-card-top">
            <span className="stat-label">Completed</span>
            <span className="stat-icon">✔️</span>
          </div>
          <span className="stat-value">{stats.completed}</span>
        </div>

        <div className="stat-card stat-card--pending">
          <div className="stat-card-top">
            <span className="stat-label">Pending</span>
            <span className="stat-icon">🕗</span>
          </div>
          <span className="stat-value">{stats.pending}</span>
        </div>

        <div className="stat-card stat-card--high">
          <div className="stat-card-top">
            <span className="stat-label">High Priority</span>
            <span className="stat-icon">⚡</span>
          </div>
          <span className="stat-value">{stats.highPriority}</span>
        </div>
      </div>

      {/* Completion progress */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Overall Progress</h2>
        </div>
        <div className="progress-row">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionRate}%` }}
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="progress-percent">{completionRate}%</span>
        </div>
      </div>

      {/* Upcoming tasks */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Upcoming Tasks</h2>
          <Link to="/tasks">View all →</Link>
        </div>

        {upcoming.length === 0 ? (
          <p>No pending tasks right now — you&apos;re all caught up.</p>
        ) : (
          <div className="mini-task-list">
            {upcoming.map((task) => (
              <div className="mini-task-row" key={task.id}>
                <span className="mini-task-title">{task.title}</span>
                <div className="mini-task-meta">
                  <span
                    className={`badge ${
                      task.priority === 'High'
                        ? 'badge-priority-high'
                        : task.priority === 'Medium'
                        ? 'badge-priority-medium'
                        : 'badge-priority-low'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="mini-task-date">
                    {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

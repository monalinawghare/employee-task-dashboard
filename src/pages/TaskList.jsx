import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import SearchFilter from '../components/SearchFilter';
import '../styles/task.css';


function TaskList() {
  const { tasks, deleteTask, toggleComplete, reorderTasks } = useTasks();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Drag-and-drop local state (not persisted, purely for visual feedback).
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Search + filter combined. Memoized so we don't recompute on every
  // unrelated re-render (e.g. drag-over state changes).
  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case 'completed':
          return task.status === 'Completed';
        case 'pending':
          return task.status === 'Pending';
        case 'high':
          return task.priority === 'High';
        default:
          return true;
      }
    });
  }, [tasks, searchTerm, activeFilter]);

  // --- Drag and drop handlers ----------------------------------------------
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== draggedId) setDragOverId(id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      reorderTasks(draggedId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Task List</h1>
          <p className="page-subtitle">Search, filter, and manage every task in one place.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          + Add Task
        </Link>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {tasks.length > 0 && (
        <p className="drag-hint">💡 Tip: drag and drop cards to reorder your tasks.</p>
      )}

      <p className="results-count">
        Showing {visibleTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </p>

      {visibleTasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🗂️</span>
          <h3>No tasks found</h3>
          <p>
            {tasks.length === 0
              ? 'You have no tasks yet. Create your first one to get started.'
              : 'Try adjusting your search or filter to find what you\'re looking for.'}
          </p>
        </div>
      ) : (
        <div className="task-grid">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              draggable
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDragging={draggedId === task.id}
              isDragOver={dragOverId === task.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;

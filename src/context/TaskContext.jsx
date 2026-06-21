import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// TaskContext
// Centralised state management for the whole app using the Context API.
// Handles:
//  - Task CRUD operations
//  - Persisting tasks to localStorage (and re-hydrating on load)
//  - Dark mode preference (also persisted)
//  - Lightweight toast notification queue
// ---------------------------------------------------------------------------

const TaskContext = createContext(undefined);

const STORAGE_KEY = 'etd_tasks';
const THEME_KEY = 'etd_theme';

// Sample data used only the very first time the app runs (empty storage).
// Mimics what you might pull from an API like JSONPlaceholder, reshaped
// to fit this app's task schema.
const SEED_TASKS = [
  {
    id: 'seed-1',
    title: 'Prepare onboarding checklist',
    description: 'Draft the checklist new hires complete during their first week, covering accounts, equipment, and intro meetings.',
    priority: 'High',
    status: 'Pending',
    dueDate: nextDate(2),
  },
  {
    id: 'seed-2',
    title: 'Complete Project Documentation',
    description: 'Prepare and finalize all project documents including SRS, design, and testing reports.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: nextDate(-1),
  },
  {
    id: 'seed-3',
    title: 'API Integration',
    description: 'Integrate third-party APIs and test data exchange between systems.',
    priority: 'High',
    status: 'Pending',
    dueDate: nextDate(1),
  },
  {
    id: 'seed-4',
    title: 'Update User Profile Feature',
    description: 'Allow users to edit and update their profile information.',
    priority: 'Low',
    status: 'Pending',
    dueDate: nextDate(5),
  },
];

function nextDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_TASKS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED_TASKS;
    return parsed;
  } catch (err) {
    // Corrupted storage shouldn't crash the app - fall back to seed data.
    console.error('Failed to parse tasks from localStorage:', err);
    return SEED_TASKS;
  }
}

function loadThemeFromStorage() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch {
    return 'light';
  }
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasksFromStorage);
  const [theme, setTheme] = useState(loadThemeFromStorage);
  const [toasts, setToasts] = useState([]);

  // Persist tasks to localStorage whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
      showToast('Could not save changes locally. Storage may be full.', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // Persist + apply theme.
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.error('Failed to save theme to localStorage:', err);
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Toast notifications -------------------------------------------------
  const showToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-dismiss after 3.2s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Theme ---------------------------------------------------------------
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // --- CRUD operations -------------------------------------------------------
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      priority: taskData.priority,
      status: 'Pending',
      dueDate: taskData.dueDate,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added successfully', 'success');
    return newTask;
  }, [showToast]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    showToast('Task updated successfully', 'success');
  }, [showToast]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    showToast('Task deleted', 'info');
  }, [showToast]);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
          : task
      )
    );
  }, []);

  const getTaskById = useCallback(
    (id) => tasks.find((task) => task.id === id),
    [tasks]
  );

  // Reorders tasks - used for drag-and-drop within the Task List page.
  const reorderTasks = useCallback((sourceId, targetId) => {
    setTasks((prev) => {
      const sourceIndex = prev.findIndex((t) => t.id === sourceId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return prev;
      }
      const updated = [...prev];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  }, []);

  // --- Derived statistics for the Dashboard --------------------------------
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    highPriority: tasks.filter((t) => t.priority === 'High').length,
  };

  const value = {
    tasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTaskById,
    reorderTasks,
    theme,
    toggleTheme,
    toasts,
    showToast,
    dismissToast,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Custom hook for consuming the context with a guard against misuse.
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

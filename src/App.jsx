import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import NotFound from './pages/NotFound';

/**
 * App
 * Root component: wires up the TaskProvider (global state + localStorage
 * persistence), the router, and the shared layout (Navbar + page content
 * + toast notifications).
 */
function App() {
  return (
    <TaskProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/add-task" element={<AddTask />} />
              <Route path="/edit-task/:id" element={<EditTask />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ToastContainer />
        </BrowserRouter>
      </ErrorBoundary>
    </TaskProvider>
  );
}

export default App;

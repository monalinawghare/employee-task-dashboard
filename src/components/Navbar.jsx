import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './Navbar.css';

/**
 * Top navigation bar.
 * - Highlights the active route
 * - Houses the dark mode toggle
 * - Collapses into a hamburger menu on small screens
 */
function Navbar() {
  const { theme, toggleTheme } = useTasks();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) => `navbar-link${isActive ? ' active' : ''}`;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <img
            src="/employee.png"
            alt="Employee logo"
            className="navbar-brand-logo"
            aria-hidden="true"
          />
          <span>Task Dashboard</span>
        </div>

        <div className="navbar-actions">
          <nav className={`navbar-links${mobileOpen ? ' mobile-open' : ''}`} aria-label="Primary navigation">
            <NavLink to="/" end className={navLinkClass} onClick={closeMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass} onClick={closeMobileMenu}>
              Tasks
            </NavLink>
            <NavLink to="/add-task" className={navLinkClass} onClick={closeMobileMenu}>
              Add Task
            </NavLink>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button
            type="button"
            className={`navbar-toggle${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
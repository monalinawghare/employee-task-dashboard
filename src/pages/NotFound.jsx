import { Link } from 'react-router-dom';

/** Simple catch-all page for any route that doesn't match. */
function NotFound() {
  return (
    <div className="page-shell">
      <div className="empty-state">
        <span className="empty-state-icon">🚧</span>
        <h3>Page not found</h3>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

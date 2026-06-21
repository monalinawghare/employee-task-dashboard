import { Component } from 'react';

/**
 * ErrorBoundary
 * Catches rendering errors anywhere in the component tree below it and
 * shows a friendly fallback instead of a blank white screen.
 * Class component because React error boundaries currently require
 * componentDidCatch / getDerivedStateFromError, which hooks don't support.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in component tree:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell">
          <div className="empty-state">
            <span className="empty-state-icon">⚠️</span>
            <h3>Something went wrong</h3>
            <p>An unexpected error occurred while rendering this page.</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={this.handleReload}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Optionally log to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;

    if (hasError) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>

            <h1 className="error-title">Oops! Something went wrong</h1>

            <p className="error-description">
              We encountered an unexpected error. Please try refreshing the page or going back.
            </p>

            {isDev && error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <div className="error-stack">
                  <h3>{error.toString()}</h3>
                  {errorInfo && (
                    <pre>{errorInfo.componentStack}</pre>
                  )}
                </div>
              </details>
            )}

            {errorCount > 3 && (
              <div className="error-warning">
                ⚠️ Multiple errors detected. Try clearing your browser cache or restarting the app.
              </div>
            )}

            <div className="error-actions">
              <button onClick={this.handleReset} className="error-button primary">
                Try Again
              </button>
              <button onClick={() => window.location.href = '/'} className="error-button secondary">
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

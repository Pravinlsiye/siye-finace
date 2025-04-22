import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
            }}
            className="retry-button"
          >
            Try Again
          </button>

          <style>{`
            .error-boundary {
              padding: var(--spacing-lg);
              margin: var(--spacing-lg);
              border: 1px solid var(--error-color);
              border-radius: var(--border-radius-md);
              background-color: var(--background-color-light);
            }

            .error-boundary h2 {
              color: var(--error-color);
              margin-bottom: var(--spacing-md);
            }

            .error-boundary details {
              margin: var(--spacing-md) 0;
              padding: var(--spacing-md);
              background-color: var(--background-color);
              border-radius: var(--border-radius-sm);
            }

            .error-boundary summary {
              cursor: pointer;
              color: var(--text-color);
              font-weight: bold;
            }

            .retry-button {
              padding: var(--spacing-sm) var(--spacing-md);
              background-color: var(--primary-color);
              color: white;
              border: none;
              border-radius: var(--border-radius-sm);
              cursor: pointer;
              transition: background-color 0.2s;
            }

            .retry-button:hover {
              background-color: var(--primary-color-dark);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
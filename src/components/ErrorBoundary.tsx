import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportClientError } from '@/services/clientErrorService';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportClientError({
      source: 'web',
      level: 'critical',
      category: 'render',
      message: error.message || 'React render error',
      stack: error.stack,
      context: {
        route: window.location.pathname,
        componentStack: info.componentStack ?? undefined,
      },
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <h1 style={{ fontSize: 20, fontWeight: 600 }}>Something went wrong.</h1>
            <p style={{ color: '#71717a', marginTop: 8 }}>
              The error has been reported. Please try reloading.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
            >
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

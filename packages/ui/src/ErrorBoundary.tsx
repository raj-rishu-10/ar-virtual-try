import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AR Platform Error uncaught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
          <div className="max-w-md p-6 rounded-2xl bg-red-500/10 border border-red-500/20 shadow-xl">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">AR System Interruption</h2>
            <p className="text-sm text-slate-400 mb-6">
              {this.state.error?.message || 'A critical error occurred while initializing the AR face tracking engine or camera device.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-sm font-semibold tracking-wide transition-colors"
            >
              Restart Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

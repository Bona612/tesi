'use client'

import React, { ReactNode, ErrorInfo } from 'react';

type State = { error: Error | null };
type Props = {
  fallback: ReactNode;
  children: ReactNode;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Set some state derived from the caught error
    return { error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      // Render the fallback UI if there's an error
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
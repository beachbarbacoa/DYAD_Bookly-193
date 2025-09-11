import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class RootErrorBoundary extends Component<{children: ReactNode}, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Root Error Boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold">Application Error</h1>
          <pre className="text-sm text-muted-foreground max-w-full overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <Button onClick={() => window.location.reload()}>
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
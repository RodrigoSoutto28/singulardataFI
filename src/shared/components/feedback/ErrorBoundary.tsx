import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const isDev = import.meta.env.DEV;

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log para debugging — no se muestra al usuario en producción
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              Algo salió mal
            </h1>
            <p className="text-sm text-muted-foreground">
              Ocurrió un error inesperado. Por favor, recarga la aplicación
              para continuar.
            </p>
          </div>
          {isDev && this.state.error && (
            <pre className="text-left text-xs bg-muted/50 border border-border rounded-md p-3 overflow-auto max-h-48 font-mono">
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
          )}
          <Button onClick={this.handleReload} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Recargar aplicación
          </Button>
        </div>
      </div>
    );
  }
}


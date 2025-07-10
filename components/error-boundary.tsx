"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback && this.state.error) {
        return (
          <Fallback error={this.state.error} resetError={this.resetError} />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({
  error,
  resetError,
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-red-400 text-2xl">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-red-950 border-red-800">
            <AlertDescription className="text-red-200">
              We apologize for the inconvenience. An unexpected error has
              occurred. Please try refreshing the page or contact support if the
              problem persists.
            </AlertDescription>
          </Alert>

          {isDevelopment && error && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-300">
                Error Details (Development)
              </h3>
              <div className="bg-zinc-800 p-4 rounded-md">
                <pre className="text-sm text-red-300 whitespace-pre-wrap break-words">
                  {error.name}: {error.message}
                </pre>
                {error.stack && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-zinc-400 hover:text-zinc-300">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-zinc-500 whitespace-pre-wrap break-words">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              onClick={resetError}
              className="bg-white text-black hover:bg-zinc-200"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="border-zinc-600 text-white hover:bg-zinc-800"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// API Error Component for fetch failures
export function APIErrorFallback({
  error,
  retry,
  children,
}: {
  error: string;
  retry?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Alert className="bg-red-950 border-red-800">
      <AlertDescription className="text-red-200">
        <div className="space-y-3">
          <p>{error}</p>
          {retry && (
            <Button
              size="sm"
              onClick={retry}
              className="bg-red-800 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          )}
          {children}
        </div>
      </AlertDescription>
    </Alert>
  );
}

"use client";

import { DefaultErrorFallback } from "@/components/error-boundary";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App error:", error);
  }, [error]);

  return <DefaultErrorFallback error={error} resetError={reset} />;
}

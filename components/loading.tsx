"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Main loading component
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-white ${sizeClasses[size]} ${className}`}
    />
  );
}

// Full page loading
export function PageLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-zinc-400">Loading...</p>
      </div>
    </div>
  );
}

// Repository list loading skeleton
export function RepositoryListLoading() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 bg-zinc-800 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-1/3 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-16 bg-zinc-800" />
                    <Skeleton className="h-3 w-20 bg-zinc-800" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Dashboard loading skeleton
export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation skeleton */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Skeleton className="h-6 w-24 bg-zinc-800" />
          <Skeleton className="h-6 w-20 bg-zinc-800" />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <Skeleton className="h-4 w-96 bg-zinc-800" />
          </div>

          {/* Repository cards skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32 bg-zinc-800" />
                      <Skeleton className="h-4 w-48 bg-zinc-800" />
                    </div>
                    <Skeleton className="h-9 w-24 bg-zinc-800" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-3 p-3 rounded border border-zinc-800"
                    >
                      <Skeleton className="h-4 w-4 bg-zinc-800 rounded-full mt-1" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                        <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Commit list loading
export function CommitListLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded border border-zinc-800"
        >
          <Skeleton className="h-4 w-4 bg-zinc-800 rounded-full mt-1" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4 bg-zinc-800" />
            <Skeleton className="h-3 w-1/2 bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

// AI Summary loading
export function AISummaryLoading() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-zinc-400">
              Generating AI summary...
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full bg-zinc-800" />
        <Skeleton className="h-4 w-5/6 bg-zinc-800" />
        <Skeleton className="h-4 w-4/5 bg-zinc-800" />
        <div className="space-y-2 mt-6">
          <Skeleton className="h-5 w-24 bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800" />
        </div>
      </CardContent>
    </Card>
  );
}

// Inline loading for buttons
export function ButtonLoading({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      {children}
    </div>
  );
}

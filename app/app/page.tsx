"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  updated_at: string;
  language: string | null;
}

export default function AppPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);

  // Check if user is already connected on page load
  useEffect(() => {
    const accessToken = localStorage.getItem("github_access_token");
    if (accessToken) {
      setIsConnected(true);
      fetchRepositories();
    }
  }, []);

  const connectToGitHub = () => {
    // For now, we'll simulate the OAuth flow
    // In a real implementation, this would redirect to GitHub OAuth
    const clientId =
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "your_github_client_id";
    const redirectUri = `${window.location.origin}/app/callback`;
    const scope = "repo,read:user";

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const fetchRepositories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("github_access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        "https://api.github.com/user/repos?sort=updated&per_page=30",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const repos = await response.json();
      setRepositories(repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRepoSelection = (repoId: number) => {
    const newSelection = new Set(selectedRepos);
    if (newSelection.has(repoId)) {
      newSelection.delete(repoId);
    } else {
      newSelection.add(repoId);
    }
    setSelectedRepos(newSelection);
  };

  const startTracking = async () => {
    if (selectedRepos.size === 0) return;

    setIsTracking(true);
    setError(null);

    try {
      // Get the selected repository details
      const selectedRepoData = repositories.filter((repo) =>
        selectedRepos.has(repo.id)
      );

      // Save to localStorage for now (in production, save to database)
      const trackingData = {
        repositories: selectedRepoData,
        startDate: new Date().toISOString(),
        accessToken: localStorage.getItem("github_access_token"),
      };

      localStorage.setItem("tlgit_tracking", JSON.stringify(trackingData));

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTrackingStarted(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/app/dashboard";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start tracking");
    } finally {
      setIsTracking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            asChild
            className="text-white hover:bg-zinc-900 p-0"
          >
            <Link href="/" className="text-xl font-light tracking-wide">
              ← TLGIT
            </Link>
          </Button>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="bg-zinc-800 text-zinc-300 border-zinc-700"
          >
            {isConnected ? "Connected" : "Not connected"}
          </Badge>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 flex items-center justify-center min-h-[calc(100vh-64px)]">
        {!isConnected ? (
          // GitHub Connection Screen
          <div className="max-w-md mx-auto text-center space-y-12 w-full">
            <div className="space-y-6">
              <h1 className="text-5xl font-extralight tracking-tight">
                Connect GitHub
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Connect your GitHub account to start generating AI-powered
                stand-up notes from your commits.
              </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <Button
                  onClick={connectToGitHub}
                  className="w-full bg-white text-black hover:bg-zinc-200 h-12"
                  size="lg"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Connect GitHub Account
                </Button>
                <p className="text-xs text-zinc-500 mt-6 leading-relaxed">
                  We only read your commit messages and repository metadata.
                  Your code stays private.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Repository Selection Screen
          <div className="space-y-12 w-full">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 text-center lg:text-left">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl font-extralight tracking-tight">
                  Select Repositories
                </h1>
                <p className="text-zinc-400 text-lg">
                  Choose which repositories you want to track for stand-up
                  generation.
                </p>
              </div>

              <div className="flex items-center gap-4 mx-auto lg:mx-0">
                <Button
                  variant="outline"
                  onClick={fetchRepositories}
                  disabled={isLoading}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-900"
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>

                {selectedRepos.size > 0 && (
                  <Button
                    onClick={startTracking}
                    disabled={isTracking}
                    className="bg-white text-black hover:bg-zinc-200 h-10 px-6"
                  >
                    {isTracking
                      ? "Starting..."
                      : `Start Tracking (${selectedRepos.size})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-950/50 border-red-900/50 text-red-300"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {trackingStarted && (
                <Alert className="bg-zinc-900 border-zinc-700 text-zinc-300">
                  <AlertDescription className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    Tracking started! Redirecting to your dashboard...
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4 max-w-4xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-1/3 bg-zinc-800" />
                        <Skeleton className="h-4 w-full bg-zinc-800" />
                        <div className="flex gap-3">
                          <Skeleton className="h-3 w-16 bg-zinc-800" />
                          <Skeleton className="h-3 w-20 bg-zinc-800" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : repositories.length > 0 ? (
              <div className="space-y-3 max-w-4xl mx-auto">
                {repositories.map((repo) => (
                  <Card
                    key={repo.id}
                    className={`cursor-pointer transition-all duration-200 border ${
                      selectedRepos.has(repo.id)
                        ? "bg-zinc-800 border-zinc-600 shadow-lg"
                        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                    }`}
                    onClick={() => toggleRepoSelection(repo.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedRepos.has(repo.id)}
                          onCheckedChange={() => toggleRepoSelection(repo.id)}
                          className="mt-1 border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:text-black"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-lg text-white">
                              {repo.name}
                            </h3>
                            {repo.private && (
                              <Badge
                                variant="secondary"
                                className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs"
                              >
                                Private
                              </Badge>
                            )}
                          </div>

                          {repo.description && (
                            <p className="text-zinc-400 leading-relaxed">
                              {repo.description}
                            </p>
                          )}

                          <div className="flex items-center gap-6 text-sm text-zinc-500">
                            {repo.language && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                                {repo.language}
                              </div>
                            )}
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800 max-w-4xl mx-auto">
                <CardContent className="p-16 text-center">
                  <p className="text-zinc-500">No repositories found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

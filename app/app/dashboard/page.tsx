"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Markdown } from "@/components/ui/markdown";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  updated_at: string;
  language: string | null;
}

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

interface TrackingData {
  repositories: Repository[];
  startDate: string;
  accessToken: string;
}

interface AISummary {
  summary: string;
  insights: Array<{
    sha: string;
    insight: string;
  }>;
  metadata: {
    commitCount: number;
    timeframe: string;
    repositoryName: string;
    generatedAt: string;
  };
}

export default function DashboardPage() {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [commits, setCommits] = useState<{ [repoId: number]: Commit[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSummaries, setAiSummaries] = useState<{
    [repoId: number]: AISummary;
  }>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState<{
    [repoId: number]: boolean;
  }>({});
  const [aiError, setAiError] = useState<string | null>(null);

  const loadTrackingData = useCallback(async () => {
    try {
      const savedData = localStorage.getItem("tlgit_tracking");
      if (!savedData) {
        throw new Error("No tracking data found");
      }

      const data: TrackingData = JSON.parse(savedData);
      setTrackingData(data);

      // Fetch recent commits for tracked repositories
      await fetchRecentCommits(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tracking data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecentCommits = async (data: TrackingData) => {
    const commitsData: { [repoId: number]: Commit[] } = {};
    const errors: string[] = [];

    for (const repo of data.repositories) {
      try {
        // Format the date properly for GitHub API
        const sinceDate = new Date(data.startDate).toISOString();
        const url = `https://api.github.com/repos/${repo.full_name}/commits?per_page=10&since=${sinceDate}`;

        console.log(
          `Fetching commits for ${repo.full_name} since ${sinceDate}`
        );
        console.log(`API URL: ${url}`);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        console.log(`Response status for ${repo.name}:`, response.status);

        if (response.ok) {
          const repoCommits = await response.json();
          console.log(`Found ${repoCommits.length} commits for ${repo.name}`);
          commitsData[repo.id] = repoCommits;

          // If no commits found since tracking started, try fetching recent commits without date filter
          if (repoCommits.length === 0) {
            console.log(
              `No commits since ${sinceDate}, trying to fetch recent commits...`
            );
            try {
              const recentResponse = await fetch(
                `https://api.github.com/repos/${repo.full_name}/commits?per_page=10`,
                {
                  headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    Accept: "application/vnd.github.v3+json",
                  },
                }
              );
              if (recentResponse.ok) {
                const recentCommits = await recentResponse.json();
                console.log(
                  `Repository has ${recentCommits.length} total recent commits`
                );
                // Store the recent commits so they show in the UI
                commitsData[repo.id] = recentCommits;
                if (recentCommits.length > 0) {
                  const lastCommitDate = new Date(
                    recentCommits[0].commit.author.date
                  );
                  console.log(
                    `Last commit was on: ${lastCommitDate.toLocaleString()}`
                  );
                }
              }
            } catch (fallbackErr) {
              console.error("Failed to fetch recent commits:", fallbackErr);
            }
          }
        } else {
          const errorText = await response.text();
          const errorMsg = `${repo.name}: ${response.status} ${response.statusText} - ${errorText}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      } catch (err) {
        const errorMsg = `Failed to fetch commits for ${repo.name}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Show errors to user if any occurred
    if (errors.length > 0) {
      setError(`GitHub API Errors:\n${errors.join("\n")}`);
    }

    setCommits(commitsData);
  };

  const generateAISummary = async (repo: Repository, repoCommits: Commit[]) => {
    if (repoCommits.length === 0) return;

    setIsGeneratingAI((prev) => ({ ...prev, [repo.id]: true }));
    setAiError(null);

    try {
      const timeframe = `since ${new Date(
        trackingData!.startDate
      ).toLocaleDateString()}`;

      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commits: repoCommits,
          repositoryName: repo.name,
          timeframe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const summary: AISummary = await response.json();
      setAiSummaries((prev) => ({ ...prev, [repo.id]: summary }));
    } catch (error) {
      console.error(`Failed to generate AI summary for ${repo.name}:`, error);
      setAiError(
        error instanceof Error ? error.message : "Failed to generate AI summary"
      );
    } finally {
      setIsGeneratingAI((prev) => ({ ...prev, [repo.id]: false }));
    }
  };

  useEffect(() => {
    loadTrackingData();
  }, [loadTrackingData]);

  const stopTracking = () => {
    localStorage.removeItem("tlgit_tracking");
    window.location.href = "/app";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="border-b border-zinc-800">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-center">
            <Skeleton className="h-8 w-20 bg-zinc-800" />
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-16 flex items-center justify-center">
          <div className="space-y-12 w-full">
            <div className="space-y-6 text-center">
              <Skeleton className="h-12 w-64 bg-zinc-800 mx-auto" />
              <Skeleton className="h-5 w-96 bg-zinc-800 mx-auto" />
            </div>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-zinc-800 mx-auto" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full bg-zinc-800" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="border-b border-zinc-800">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-center">
            <Button
              variant="ghost"
              asChild
              className="text-white hover:bg-zinc-900 p-0 absolute left-6"
            >
              <Link href="/app" className="text-xl font-light tracking-wide">
                ← TLGIT
              </Link>
            </Button>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-16 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="max-w-md mx-auto text-center space-y-8 w-full">
            <div className="space-y-6">
              <h1 className="text-4xl font-extralight tracking-tight">
                No Tracking Data
              </h1>
              <p className="text-zinc-400 text-lg">
                Start by selecting repositories to track.
              </p>
            </div>
            <Button
              asChild
              className="bg-white text-black hover:bg-zinc-200 h-12 px-6"
            >
              <Link href="/app">Go Back</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-center">
          <Button
            variant="ghost"
            asChild
            className="text-white hover:bg-zinc-900 p-0 absolute left-6"
          >
            <Link href="/app" className="text-xl font-light tracking-wide">
              ← TLGIT
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
              {trackingData.repositories.length} repositories
            </Badge>
            <Button
              variant="outline"
              onClick={stopTracking}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 absolute right-6"
            >
              Stop Tracking
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl font-extralight tracking-tight">
                Dashboard
              </h1>
              <p className="text-zinc-400 text-lg">
                AI-generated stand-up notes from your tracked repositories
              </p>
            </div>
            <Button
              variant="outline"
              onClick={loadTrackingData}
              disabled={isLoading}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 mx-auto lg:mx-0"
            >
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>

          {/* Error Alerts */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-950/50 border-red-900/50 text-red-300"
              >
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">GitHub API Error:</div>
                    <pre className="text-xs whitespace-pre-wrap">{error}</pre>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {aiError && (
              <Alert
                variant="destructive"
                className="bg-red-950/50 border-red-900/50 text-red-300"
              >
                <AlertDescription>
                  AI Error: {aiError}
                  {aiError.includes("API key") && (
                    <div className="mt-2 text-sm">
                      Make sure to set the{" "}
                      <code className="bg-red-900/50 px-1 rounded">
                        OPENAI_API_KEY
                      </code>{" "}
                      environment variable.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Tracked Repositories */}
          <div className="space-y-8">
            <h2 className="text-2xl font-light tracking-wide text-center lg:text-left">
              Tracked Repositories
            </h2>
            <div className="grid gap-8 max-w-4xl mx-auto">
              {trackingData.repositories.map((repo) => (
                <Card key={repo.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-6">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 text-center lg:text-left">
                        <CardTitle className="text-2xl font-light text-white">
                          {repo.name}
                        </CardTitle>
                        {repo.description && (
                          <p className="text-zinc-400 text-sm leading-relaxed">
                            {repo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mx-auto lg:mx-0">
                        {repo.private && (
                          <Badge
                            variant="secondary"
                            className="bg-zinc-800 text-zinc-400 border-zinc-700"
                          >
                            Private
                          </Badge>
                        )}
                        {commits[repo.id] && commits[repo.id].length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              generateAISummary(repo, commits[repo.id])
                            }
                            disabled={isGeneratingAI[repo.id]}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          >
                            {isGeneratingAI[repo.id]
                              ? "Generating..."
                              : "AI Summary"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-8">
                      {/* AI Summary Section */}
                      {aiSummaries[repo.id] && (
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center justify-center lg:justify-start gap-3 text-white">
                            AI Summary
                            <Badge
                              variant="outline"
                              className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700"
                            >
                              {aiSummaries[repo.id].metadata.commitCount}{" "}
                              commits
                            </Badge>
                          </h4>
                          <div className="bg-zinc-800/50 rounded-lg p-6 space-y-4">
                            <div className="prose prose-sm max-w-none text-sm text-zinc-300 leading-relaxed">
                              <Markdown>
                                {aiSummaries[repo.id].summary}
                              </Markdown>
                            </div>
                            <div className="text-xs text-zinc-500 text-center lg:text-left">
                              Generated{" "}
                              {new Date(
                                aiSummaries[repo.id].metadata.generatedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Commits Section */}
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center justify-center lg:justify-start gap-3 text-white">
                          Recent Commits
                          <Badge
                            variant="outline"
                            className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700"
                          >
                            {commits[repo.id]?.length || 0}
                          </Badge>
                        </h4>

                        {commits[repo.id] && commits[repo.id].length > 0 ? (
                          <ScrollArea className="h-96 w-full rounded-md border border-zinc-800">
                            <div className="p-4 space-y-4">
                              {commits[repo.id].map((commit, index) => {
                                const insight = aiSummaries[
                                  repo.id
                                ]?.insights.find((i) => i.sha === commit.sha);
                                return (
                                  <div key={commit.sha} className="space-y-3">
                                    <div className="flex items-start gap-4">
                                      <div className="w-2 h-2 rounded-full bg-zinc-600 mt-2 flex-shrink-0" />
                                      <div className="flex-1 space-y-2">
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium text-white leading-relaxed">
                                            {commit.commit.message}
                                          </p>
                                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span>
                                              {commit.commit.author.name}
                                            </span>
                                            <span>
                                              {formatDate(
                                                commit.commit.author.date
                                              )}
                                            </span>
                                            <span className="font-mono">
                                              {commit.sha.substring(0, 7)}
                                            </span>
                                          </div>
                                        </div>
                                        {insight && (
                                          <div className="bg-zinc-800 border border-zinc-700 rounded p-3 text-xs text-zinc-300">
                                            <span className="font-medium text-zinc-200">
                                              AI Insight:{" "}
                                            </span>
                                            {insight.insight}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {index < commits[repo.id].length - 1 && (
                                      <Separator className="ml-6 bg-zinc-800" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        ) : (
                          <Alert className="bg-zinc-800/50 border-zinc-700 text-zinc-400">
                            <AlertDescription className="text-center">
                              No commits found since tracking started
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

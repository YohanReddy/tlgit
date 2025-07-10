"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  updated_at: string;
  language: string | null;
}

export interface Commit {
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

export interface TrackingData {
  repositories: Repository[];
  startDate: string;
  accessToken: string;
}

export interface AISummary {
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

interface UseGitHubDataReturn {
  trackingData: TrackingData | null;
  commits: { [repoId: number]: Commit[] };
  aiSummaries: { [repoId: number]: AISummary };
  isLoading: boolean;
  error: string | null;
  isGeneratingAI: { [repoId: number]: boolean };
  aiError: string | null;
  generateAISummary: (repo: Repository, repoCommits: Commit[]) => Promise<void>;
  retryFetch: () => void;
  stopTracking: () => void;
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

export function useGitHubData(): UseGitHubDataReturn {
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

  const fetchRecentCommits = useCallback(async (data: TrackingData) => {
    const commitsData: { [repoId: number]: Commit[] } = {};
    const errors: string[] = [];

    // Process repositories in batches to avoid rate limiting
    const batchSize = 3;
    for (let i = 0; i < data.repositories.length; i += batchSize) {
      const batch = data.repositories.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (repo) => {
          try {
            const cacheKey = `commits-${repo.id}-${data.startDate}`;
            const cachedCommits = getCachedData<Commit[]>(cacheKey);

            if (cachedCommits) {
              commitsData[repo.id] = cachedCommits;
              return;
            }

            const sinceDate = new Date(data.startDate).toISOString();
            const url = `https://api.github.com/repos/${repo.full_name}/commits?per_page=10&since=${sinceDate}`;

            const response = await fetch(url, {
              headers: {
                Authorization: `Bearer ${data.accessToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            });

            if (response.ok) {
              const repoCommits = await response.json();
              commitsData[repo.id] = repoCommits;
              setCachedData(cacheKey, repoCommits);

              // If no commits since tracking started, try fetching recent commits
              if (repoCommits.length === 0) {
                const recentCacheKey = `recent-commits-${repo.id}`;
                const cachedRecentCommits =
                  getCachedData<Commit[]>(recentCacheKey);

                if (cachedRecentCommits) {
                  commitsData[repo.id] = cachedRecentCommits;
                } else {
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
                    commitsData[repo.id] = recentCommits;
                    setCachedData(recentCacheKey, recentCommits, 2 * 60 * 1000); // 2 minutes TTL for recent commits
                  }
                }
              }
            } else {
              const errorText = await response.text();
              errors.push(
                `${repo.name}: ${response.status} ${response.statusText}`
              );
            }
          } catch (err) {
            errors.push(
              `Failed to fetch commits for ${repo.name}: ${
                err instanceof Error ? err.message : "Unknown error"
              }`
            );
          }
        })
      );

      // Add delay between batches to respect rate limits
      if (i + batchSize < data.repositories.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (errors.length > 0) {
      setError(`GitHub API Errors:\n${errors.join("\n")}`);
    }

    setCommits(commitsData);
  }, []);

  const loadTrackingData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const savedData = localStorage.getItem("tlgit_tracking");
      if (!savedData) {
        throw new Error("No tracking data found");
      }

      const data: TrackingData = JSON.parse(savedData);
      setTrackingData(data);

      await fetchRecentCommits(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tracking data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchRecentCommits]);

  const generateAISummary = useCallback(
    async (repo: Repository, repoCommits: Commit[]) => {
      if (repoCommits.length === 0) return;

      setIsGeneratingAI((prev) => ({ ...prev, [repo.id]: true }));
      setAiError(null);

      try {
        const timeframe = `since ${new Date(
          trackingData!.startDate
        ).toLocaleDateString()}`;

        // Check cache first
        const cacheKey = `ai-summary-${repo.id}-${repoCommits.length}-${timeframe}`;
        const cachedSummary = getCachedData<AISummary>(cacheKey);

        if (cachedSummary) {
          setAiSummaries((prev) => ({ ...prev, [repo.id]: cachedSummary }));
          return;
        }

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

        // Cache the summary for 10 minutes
        setCachedData(cacheKey, summary, 10 * 60 * 1000);
      } catch (error) {
        setAiError(
          error instanceof Error
            ? error.message
            : "Failed to generate AI summary"
        );
      } finally {
        setIsGeneratingAI((prev) => ({ ...prev, [repo.id]: false }));
      }
    },
    [trackingData]
  );

  const retryFetch = useCallback(() => {
    loadTrackingData();
  }, [loadTrackingData]);

  const stopTracking = useCallback(() => {
    localStorage.removeItem("tlgit_tracking");
    window.location.href = "/app";
  }, []);

  useEffect(() => {
    loadTrackingData();
  }, [loadTrackingData]);

  // Memoize expensive computations
  const memoizedData = useMemo(
    () => ({
      trackingData,
      commits,
      aiSummaries,
      isLoading,
      error,
      isGeneratingAI,
      aiError,
      generateAISummary,
      retryFetch,
      stopTracking,
    }),
    [
      trackingData,
      commits,
      aiSummaries,
      isLoading,
      error,
      isGeneratingAI,
      aiError,
      generateAISummary,
      retryFetch,
      stopTracking,
    ]
  );

  return memoizedData;
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setStatus("error");
        setError("GitHub authorization was denied or failed");
        return;
      }

      if (!code) {
        setStatus("error");
        setError("No authorization code received from GitHub");
        return;
      }

      try {
        // Exchange authorization code for access token
        const response = await fetch("/api/auth/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange authorization code");
        }

        const { access_token } = await response.json();

        // Store the access token in localStorage
        localStorage.setItem("github_access_token", access_token);

        setStatus("success");

        // Redirect to app page after a short delay
        setTimeout(() => {
          router.push("/app");
        }, 2000);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center space-y-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="text-xl font-semibold">
              TLGIT
            </Link>
          </Button>

          <Card>
            <CardContent className="p-8 text-center space-y-6">
              {status === "loading" && (
                <>
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">
                      Connecting to GitHub...
                    </h1>
                    <p className="text-muted-foreground">
                      Please wait while we set up your account.
                    </p>
                  </div>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">
                      Successfully Connected!
                    </h1>
                    <p className="text-muted-foreground">
                      Your GitHub account has been connected. Redirecting to
                      your dashboard...
                    </p>
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="w-16 h-16 mx-auto bg-destructive rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h1 className="text-2xl font-semibold">
                        Connection Failed
                      </h1>
                      <p className="text-muted-foreground">{error}</p>
                    </div>
                    <Button asChild>
                      <Link href="/app">Try Again</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

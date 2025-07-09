import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-light tracking-wide">TLGIT</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Side - Hero */}
            <div className="space-y-12">
              <div className="space-y-8">
                <Badge
                  variant="outline"
                  className="w-fit bg-zinc-800 text-zinc-300 border-zinc-700"
                >
                  AI-Powered Development Notes
                </Badge>
                <h1 className="text-6xl font-extralight tracking-tight leading-[1.1]">
                  Turn commits into{" "}
                  <span className="text-zinc-400">stand-ups</span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                  AI reads your GitHub commits and writes your stand-up notes
                  automatically. Save time and improve team communication.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Button
                  asChild
                  className="bg-white text-black hover:bg-zinc-200 h-12 px-8 text-base"
                >
                  <Link href="/app">Get Started Free</Link>
                </Button>
                <div className="text-sm text-zinc-500">No setup required</div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
                <div className="space-y-3">
                  <div className="font-medium text-white">Automatic</div>
                  <div className="text-sm text-zinc-500">Zero setup</div>
                </div>
                <div className="space-y-3">
                  <div className="font-medium text-white">Intelligent</div>
                  <div className="text-sm text-zinc-500">AI-powered</div>
                </div>
                <div className="space-y-3">
                  <div className="font-medium text-white">Ready</div>
                  <div className="text-sm text-zinc-500">Instant delivery</div>
                </div>
              </div>
            </div>

            {/* Right Side - Demo */}
            <div className="space-y-8">
              <div className="text-sm text-zinc-500">
                Yesterday&apos;s output →
              </div>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8">
                  <div className="font-mono text-sm space-y-6">
                    <div className="text-zinc-400">
                      # Stand-up for Dec 15, 2024
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span className="text-zinc-300">
                          Fixed authentication bug in login flow
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span className="text-zinc-300">
                          Added dark mode toggle to settings
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span className="text-zinc-300">
                          Optimized database queries for dashboard
                        </span>
                      </div>
                    </div>
                    <div className="text-zinc-400 pt-3"># Planning today</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span className="text-zinc-300">
                          Test new authentication system
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span className="text-zinc-300">
                          Review pull requests from team
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="text-sm text-zinc-500">
                Generated from 12 commits across 3 repositories
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

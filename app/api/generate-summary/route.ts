import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

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

interface CommitSummaryRequest {
  commits: Commit[];
  repositoryName: string;
  timeframe: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body: CommitSummaryRequest = await request.json();
    const { commits, repositoryName, timeframe } = body;

    if (!commits || commits.length === 0) {
      return NextResponse.json(
        { error: "No commits provided" },
        { status: 400 }
      );
    }

    // Prepare commit data for AI analysis
    const commitMessages = commits
      .map(
        (commit, index) =>
          `${index + 1}. ${commit.commit.message} (by ${
            commit.commit.author.name
          } on ${new Date(commit.commit.author.date).toLocaleDateString()})`
      )
      .join("\n");

    const prompt = `Analyze the following ${commits.length} commits from the ${repositoryName} repository over ${timeframe} and generate a professional stand-up summary:

${commitMessages}

Please provide:
1. A brief summary of what was accomplished
2. Key technical changes or improvements
3. Any patterns you notice (bug fixes, features, refactoring, etc.)
4. Suggested talking points for a stand-up meeting

Format the response as markdown with clear sections. Keep it concise but informative.`;

    const { text: summary } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 800,
      temperature: 0.3,
    });

    // Generate individual commit insights
    const insights = [];
    if (commits.length <= 10) {
      // Only generate individual insights for smaller commit sets to avoid rate limits
      for (const commit of commits.slice(0, 5)) {
        try {
          const { text: insight } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: `Briefly explain what this commit does in 1-2 sentences: "${commit.commit.message}"`,
            maxTokens: 100,
            temperature: 0.2,
          });
          insights.push({
            sha: commit.sha,
            insight: insight.trim(),
          });
        } catch (error) {
          console.error(
            `Failed to generate insight for commit ${commit.sha}:`,
            error
          );
          insights.push({
            sha: commit.sha,
            insight: "Unable to generate insight for this commit.",
          });
        }
      }
    }

    return NextResponse.json({
      summary: summary.trim(),
      insights,
      metadata: {
        commitCount: commits.length,
        timeframe,
        repositoryName,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating commit summary:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key" },
          { status: 401 }
        );
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }
}

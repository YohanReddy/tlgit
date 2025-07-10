import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title =
      searchParams.get("title") || "TLGIT - Transform Your GitHub Commits";
    const description =
      searchParams.get("description") ||
      "AI-powered GitHub commit analysis that generates stand-up notes automatically";
    const type = searchParams.get("type") || "default";

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: "48px",
              fontWeight: "300",
              color: "#ffffff",
              marginBottom: "40px",
              letterSpacing: "8px",
            }}
          >
            TLGIT
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: type === "summary" ? "56px" : "72px",
              fontWeight: "200",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.1",
              marginBottom: "32px",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "32px",
              color: "#a1a1aa",
              textAlign: "center",
              lineHeight: "1.4",
              maxWidth: "800px",
              marginBottom: "60px",
            }}
          >
            {description}
          </div>

          {/* Feature badges */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "#27272a",
                color: "#d4d4d8",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "20px",
                border: "1px solid #3f3f46",
              }}
            >
              🤖 AI-Powered
            </div>
            <div
              style={{
                background: "#27272a",
                color: "#d4d4d8",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "20px",
                border: "1px solid #3f3f46",
              }}
            >
              ⚡ Automatic
            </div>
            <div
              style={{
                background: "#27272a",
                color: "#d4d4d8",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "20px",
                border: "1px solid #3f3f46",
              }}
            >
              📊 Insights
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error("Error generating OG image:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

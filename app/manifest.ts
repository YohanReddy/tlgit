import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TLGIT - AI-Powered GitHub Commit Analysis",
    short_name: "TLGIT",
    description:
      "Transform your GitHub commits into smart stand-up notes with AI-powered analysis",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["productivity", "developer", "utilities"],
    screenshots: [
      {
        src: "/api/og?type=screenshot",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}

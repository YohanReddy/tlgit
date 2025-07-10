import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/app/callback", "/_next/", "/private/"],
      },
    ],
    sitemap: "https://tlgit.dev/sitemap.xml",
    host: "https://tlgit.dev",
  };
}

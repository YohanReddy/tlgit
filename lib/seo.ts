import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://tlgit.dev"),
  title: {
    default: "TLGIT - Transform Your GitHub Commits into Smart Stand-up Notes",
    template: "%s | TLGIT",
  },
  description:
    "AI-powered GitHub commit analysis that automatically generates stand-up notes, team insights, and progress reports. Save time and improve team communication with intelligent commit summaries.",

  keywords: [
    "GitHub",
    "commit analysis",
    "stand-up notes",
    "AI",
    "team communication",
    "developer tools",
    "productivity",
    "agile",
    "scrum",
    "development insights",
    "code review",
    "project management",
  ],

  authors: [
    {
      name: "TLGIT Team",
      url: "https://tlgit.dev",
    },
  ],

  creator: "TLGIT",
  publisher: "TLGIT",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tlgit.dev",
    siteName: "TLGIT",
    title: "TLGIT - Transform Your GitHub Commits into Smart Stand-up Notes",
    description:
      "AI-powered GitHub commit analysis that automatically generates stand-up notes, team insights, and progress reports.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "TLGIT - AI-powered GitHub commit analysis",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@tlgit_dev",
    creator: "@tlgit_dev",
    title: "TLGIT - Transform Your GitHub Commits into Smart Stand-up Notes",
    description:
      "AI-powered GitHub commit analysis that automatically generates stand-up notes and team insights.",
    images: ["/api/og?type=twitter"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },

  category: "technology",
  classification: "Developer Tools",

  alternates: {
    canonical: "https://tlgit.dev",
  },

  other: {
    "application-name": "TLGIT",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export interface PageSEOProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  type?: string;
  noindex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage,
  type = "website",
  noindex = false,
}: PageSEOProps): Metadata {
  const url = `https://tlgit.dev${path}`;
  const ogImageUrl =
    ogImage || `/api/og${title ? `?title=${encodeURIComponent(title)}` : ""}`;

  return {
    title: title || defaultMetadata.title,
    description: description || defaultMetadata.description,

    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      url,
      type: type as "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title || "TLGIT - AI-powered GitHub commit analysis",
        },
      ],
    },

    twitter: {
      ...defaultMetadata.twitter,
      title: title || defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
      images: [ogImageUrl],
    },

    alternates: {
      canonical: url,
    },

    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
  };
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TLGIT",
  description:
    "AI-powered GitHub commit analysis that automatically generates stand-up notes, team insights, and progress reports.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://tlgit.dev",
  author: {
    "@type": "Organization",
    name: "TLGIT Team",
    url: "https://tlgit.dev",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "AI-powered commit analysis",
    "Automatic stand-up note generation",
    "GitHub integration",
    "Team insights and reporting",
    "Real-time commit tracking",
  ],
};

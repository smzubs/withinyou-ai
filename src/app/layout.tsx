import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const siteName = "WithinYou";
const domain = "https://withinyouai.com";
const title = "WithinYou — Your dream life is within you. Discover it in 15 minutes.";
const description =
  "WithinYou helps you uncover your inner strengths, values, and life direction in just 15 minutes — through an intelligent, personalized discovery experience.";

export const metadata: Metadata = {
  metadataBase: new URL(domain),
  title: {
    default: title,
    template: `%s — ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    "self discovery",
    "life clarity",
    "purpose",
    "vision",
    "values",
    "goals",
    "personality",
    "coaching",
    "WithinYou",
  ],
  authors: [{ name: "WithinYou" }],
  creator: "WithinYou",
  publisher: "WithinYou",
  alternates: {
    canonical: domain,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: domain,
    siteName,
    title,
    description,
    images: [
      {
        url: "/og.png", // we saved this earlier
        width: 1200,
        height: 630,
        alt: "WithinYou — Discover your dream life in 15 minutes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/app-icon.png", sizes: "512x512", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${domain}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* JSON-LD for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

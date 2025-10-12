import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://withinyouai.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Add blocks later if you create /api/private or /admin, etc.
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

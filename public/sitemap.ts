import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://withinyouai.com";
  const now = new Date().toISOString();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Add other important pages here as you create them:
    // { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}

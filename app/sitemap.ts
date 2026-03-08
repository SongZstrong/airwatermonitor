import type { MetadataRoute } from "next";

const baseUrl = "https://airwatergo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/air-quality`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/water-quality`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}

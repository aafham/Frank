import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://frnkplus.vercel.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/collection", "/lookbook", "/journal", "/access"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route ? 0.8 : 1,
  }));
}

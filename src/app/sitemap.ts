import type { MetadataRoute } from "next";

const siteUrl = "https://frnkplus.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/collection",
    "/lookbook",
    "/journal",
    "/story",
    "/size-guide",
    "/checkout",
    "/access",
    ...["coffee-puffer-jacket", "black-studio-overshirt", "tailored-street-coat", "goggles-hoodie"].map(
      (slug) => `/collection/${slug}`,
    ),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route ? 0.8 : 1,
  }));
}

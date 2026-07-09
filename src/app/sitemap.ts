import type { MetadataRoute } from "next";

import { products } from "@/lib/frnk-data";

const siteUrl = "https://frnkplus.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/exclusive",
    "/collection",
    "/lookbook",
    "/journal",
    "/drop-01",
    "/story",
    "/size-guide",
    "/faq",
    "/shipping",
    "/returns",
    "/checkout",
    "/access",
    ...products.map((product) => `/collection/${product.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route ? 0.8 : 1,
  }));
}

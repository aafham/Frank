import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FRNK+ | Premium Minimal Streetwear",
    short_name: "FRNK+",
    description:
      "Premium minimal streetwear with dark essentials and smart silhouettes.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050403",
    theme_color: "#050403",
    categories: ["shopping", "lifestyle", "fashion"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

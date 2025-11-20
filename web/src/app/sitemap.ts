import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const urls = [
    "/",
    "/buscar",
    "/carrinho",
    "/checkout",
    "/conta",
    "/admin",
  ];
  return urls.map((path) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.5,
  }));
}


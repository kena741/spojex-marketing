import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const staticPaths = [
    "/",
    "/mini-apps",
    "/opportunities",
    "/events",
    "/news",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
    "/community-guidelines",
    "/refund-policy",
  ];
  const dynamic = [
    ...catalog.miniApps.map((item) => `/mini-apps/${item.slug}`),
    ...catalog.opportunities.map((item) => `/opportunities/${item.id}`),
    ...catalog.events.map((item) => `/events/${item.slug}`),
    ...catalog.news.map((item) => `/news/${item.slug}`),
  ];
  return [...staticPaths, ...dynamic].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function pageMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  keywords?: string[];
}): Promise<Metadata> {
  const { site } = await getCatalog();
  const pageTitle = title ? `${title} · ${site.appName}` : site.seoTitle;
  const pageDescription = description || site.seoDescription;
  const canonical = absoluteUrl(path);
  const ogImage = image || absoluteUrl("/brand/sj-mark.png");
  return {
    title: title ? { absolute: pageTitle } : { absolute: site.seoTitle },
    description: pageDescription,
    keywords: keywords?.length ? keywords : site.keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: site.appName,
      title: title || site.seoTitle,
      description: pageDescription,
      images: [{ url: ogImage, alt: site.appName }],
      locale: "en_ET",
    },
    twitter: {
      card: "summary_large_image",
      title: title || site.seoTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

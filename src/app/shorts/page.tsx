import type { Metadata } from "next";
import { AppOpenFallback } from "@/components/app-open-fallback";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Shorts on Spojex",
    description: "Open Spojex Shorts in the mobile app.",
    path: "/shorts",
  });
}

export default async function ShortsDeepLinkPage() {
  const { site } = await getCatalog();
  return (
    <AppOpenFallback
      site={site}
      title="Shorts on Spojex"
      description="Sport shorts open in the Spojex app. Download Spojex, then open this link again."
      deepLinkHint="https://spojex.app/shorts"
    />
  );
}

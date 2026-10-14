import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppOpenFallback } from "@/components/app-open-fallback";
import { getCatalog } from "@/lib/catalog";
import { isAppContentId, isPublicKey } from "@/lib/keys";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isPublicKey(id) && !isAppContentId(id)) notFound();
  return pageMetadata({
    title: "Open gym in Spojex",
    description: "This Spojex gym link opens in the mobile app.",
    path: `/gym/${encodeURIComponent(id)}`,
  });
}

export default async function GymDeepLinkPage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isPublicKey(id) && !isAppContentId(id)) notFound();
  const { site } = await getCatalog();
  return (
    <AppOpenFallback
      site={site}
      title="Gym on Spojex"
      description="This gym profile opens in the Spojex app. Download Spojex, then open the link again."
      deepLinkHint={`https://spojex.app/gym/${id}`}
    />
  );
}

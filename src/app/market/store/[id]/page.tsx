import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketLanding } from "@/components/market-landing";
import { getCatalog } from "@/lib/catalog";
import { getApiBaseUrl } from "@/lib/env";
import { isAppContentId } from "@/lib/keys";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

type Store = { name: string; avatar: string; listings: number; rating: number | null };

async function loadStore(id: string): Promise<Store | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/sports-market/sellers/${encodeURIComponent(id)}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const s = (await response.json()) as {
      seller?: { name?: string; avatar_url?: string | null };
      product_count?: number;
      rating?: { average?: number | null };
    };
    return {
      name: s.seller?.name?.trim() || "Spojex seller",
      avatar: s.seller?.avatar_url ?? "",
      listings: s.product_count ?? 0,
      rating: s.rating?.average ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isAppContentId(id)) notFound();
  const store = await loadStore(id);
  return pageMetadata({
    title: store ? `${store.name} on Spojex Marketplace` : "Spojex Marketplace",
    description: "Sports gear from approved sellers on Spojex Marketplace.",
    path: `/market/store/${encodeURIComponent(id)}`,
    image: store?.avatar || null,
  });
}

export default async function MarketStorePage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isAppContentId(id)) notFound();
  const [{ site }, store] = await Promise.all([getCatalog(), loadStore(id)]);
  const facts = store
    ? [`${store.listings} listing${store.listings === 1 ? "" : "s"}`, store.rating ? `${store.rating.toFixed(1)} ★` : ""]
        .filter(Boolean)
        .join(" · ")
    : "";
  return (
    <MarketLanding
      eyebrow="Spojex Marketplace store"
      title={store?.name ?? "A Spojex Marketplace store"}
      subtitle={`${facts ? `${facts}. ` : ""}Get the app to shop this store.`}
      imageUrl={store?.avatar ?? ""}
      round
      cta="Get Spojex to shop"
      deepLink={`spojex://market/store/${encodeURIComponent(id)}`}
      shareUrl={`https://www.spojex.com/market/store/${encodeURIComponent(id)}`}
      referrer={`market_store=${id}`}
      appStoreUrl={site.appStoreUrl}
      playStoreUrl={site.playStoreUrl}
    />
  );
}

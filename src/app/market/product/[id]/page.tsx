import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketLanding } from "@/components/market-landing";
import { getCatalog } from "@/lib/catalog";
import { getApiBaseUrl } from "@/lib/env";
import { isAppContentId } from "@/lib/keys";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

type Product = { name: string; image: string; price: string; seller: string; description: string };

function money(value: unknown, currency: string) {
  const n = Number(value ?? 0);
  return `${currency} ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** Public listing summary (the marketplace read API allows guests). */
async function loadProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/sports-market/products/${encodeURIComponent(id)}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const p = (await response.json()) as {
      name?: string;
      images?: string[];
      price?: number;
      compare_at_price?: number | null;
      currency?: string;
      description?: string;
      seller?: { name?: string };
    };
    const currency = p.currency || "ETB";
    const price = money(p.price, currency);
    return {
      name: p.name?.trim() || "Sports gear",
      image: p.images?.[0] ?? "",
      price: p.compare_at_price && p.compare_at_price > (p.price ?? 0) ? `${price} (was ${money(p.compare_at_price, currency)})` : price,
      seller: p.seller?.name?.trim() || "",
      description: (p.description ?? "").replace(/\s+/g, " ").trim().slice(0, 160),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isAppContentId(id)) notFound();
  const product = await loadProduct(id);
  return pageMetadata({
    title: product ? `${product.name} · ${product.price}` : "Spojex Marketplace",
    description: product?.description || "Sports gear from approved sellers on Spojex Marketplace.",
    path: `/market/product/${encodeURIComponent(id)}`,
    image: product?.image || null,
  });
}

export default async function MarketProductPage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isAppContentId(id)) notFound();
  const [{ site }, product] = await Promise.all([getCatalog(), loadProduct(id)]);
  return (
    <MarketLanding
      eyebrow="Spojex Marketplace"
      title={product?.name ?? "Sports gear on Spojex"}
      subtitle={
        product
          ? `${product.price}${product.seller ? ` · sold by ${product.seller}` : ""}. Get the app to buy it with delivery to your door.`
          : "This listing is on Spojex Marketplace. Get the app to see it."
      }
      imageUrl={product?.image ?? ""}
      cta="Get Spojex to buy"
      deepLink={`spojex://market/product/${encodeURIComponent(id)}`}
      shareUrl={`https://www.spojex.com/market/product/${encodeURIComponent(id)}`}
      referrer={`market_product=${id}`}
      appStoreUrl={site.appStoreUrl}
      playStoreUrl={site.playStoreUrl}
    />
  );
}

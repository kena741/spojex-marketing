import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppOpenFallback } from "@/components/app-open-fallback";
import { MediaImage } from "@/components/media-image";
import { findBySlug, getCatalog } from "@/lib/catalog";
import { formatWhen } from "@/lib/format";
import { isAppContentId, isPublicKey } from "@/lib/keys";
import { policyParagraphs } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  if (isAppContentId(slug)) {
    return pageMetadata({
      title: "Open in Spojex",
      description: "This Spojex link opens news or a gym clip in the mobile app.",
      path: `/news/${encodeURIComponent(slug)}`,
    });
  }
  if (!isPublicKey(slug)) notFound();
  const { news } = await getCatalog();
  const article = findBySlug(news, slug);
  if (!article) notFound();
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    image: article.imageUrl,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const { news, site } = await getCatalog();
  const article = isPublicKey(slug) ? findBySlug(news, slug) : null;

  if (article) {
    const paragraphs = policyParagraphs(article.body || article.summary);
    return (
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-pitch uppercase">
          {article.category}
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-semibold text-pitch-deep sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {[article.source, article.publishedAt ? formatWhen(article.publishedAt) : ""]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[1.75rem]">
          <MediaImage src={article.imageUrl} alt="" priority />
        </div>
        <div className="mt-8 space-y-4 text-base leading-7">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    );
  }

  // Shared app links (UUID / gymv:…) land here when the native app is not installed.
  if (isAppContentId(slug)) {
    const isGymClip = slug.toLowerCase().startsWith("gymv:");
    return (
      <AppOpenFallback
        site={site}
        title={isGymClip ? "Gym clip on Spojex" : "News on Spojex"}
        description={
          isGymClip
            ? "This gym video opens in the Spojex app. Download Spojex, then open the link again."
            : "This news item opens in the Spojex app. Download Spojex, then open the link again."
        }
        deepLinkHint={`https://spojex.app/news/${slug}`}
      />
    );
  }

  notFound();
}

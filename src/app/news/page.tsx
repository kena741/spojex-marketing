import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { MediaImage } from "@/components/media-image";
import { PageHero } from "@/components/page-hero";
import { getCatalog } from "@/lib/catalog";
import { formatWhen } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "News",
    description: "Sports news published on Spojex.",
    path: "/news",
  });
}

export default async function NewsPage() {
  const { news } = await getCatalog();
  return (
    <>
      <PageHero kicker="News" title="From the Spojex desk." body="Published sports stories. Drafts stay in the admin." />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {news.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="overflow-hidden rounded-[1.75rem] bg-white">
                <div className="relative h-48">
                  <MediaImage src={article.imageUrl} alt="" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-pitch uppercase">{article.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{article.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{article.summary}</p>
                  {article.publishedAt ? (
                    <p className="mt-3 text-xs text-muted">{formatWhen(article.publishedAt)}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No published news" body="Active stories will appear here." />
        )}
      </section>
    </>
  );
}

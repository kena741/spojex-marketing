import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/media-image";
import { MiniStoreButtons } from "@/components/store-buttons";
import { findBySlug, getCatalog } from "@/lib/catalog";
import { isPublicKey } from "@/lib/keys";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPublicKey(slug)) notFound();
  const { miniApps } = await getCatalog();
  const app = findBySlug(miniApps, slug);
  if (!app) notFound();
  return pageMetadata({
    title: app.name,
    description: app.summary || app.description,
    path: `/mini-apps/${app.slug}`,
    image: app.logoUrl,
  });
}

export default async function MiniAppPage({ params }: Props) {
  const { slug } = await params;
  if (!isPublicKey(slug)) notFound();
  const { miniApps } = await getCatalog();
  const app = findBySlug(miniApps, slug);
  if (!app) notFound();
  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-pitch uppercase">{app.category}</p>
        <h1 className="font-display mt-2 text-6xl leading-none font-semibold text-pitch-deep">{app.name}</h1>
        {app.partner ? <p className="mt-3 text-muted">{app.partner}</p> : null}
        <p className="mt-5 text-lg leading-8">{app.description}</p>
        {app.features.length ? (
          <ul className="mt-6 space-y-2">
            {app.features.map((feature) => (
              <li key={feature} className="rounded-2xl bg-white px-4 py-3 text-sm">
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {app.websiteUrl ? (
            <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-pitch px-5 py-3 text-sm font-semibold text-white">
              Visit website
            </a>
          ) : null}
          <MiniStoreButtons appStoreUrl={app.appStoreUrl} playStoreUrl={app.playStoreUrl} />
        </div>
        {app.deepLink ? (
          <p className="mt-4 text-sm text-muted">
            App link: <span className="break-all">{app.deepLink}</span>
          </p>
        ) : null}
        <p className="mt-6 text-xs tracking-[0.16em] text-muted uppercase">Status · Published</p>
      </div>
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-pitch-deep">
          <MediaImage src={app.logoUrl || app.screenshots[0] || null} alt={app.name} priority />
        </div>
        {app.screenshots.slice(1).map((shot) => (
          <div key={shot} className="relative aspect-video overflow-hidden rounded-3xl">
            <MediaImage src={shot} alt="" />
          </div>
        ))}
      </div>
    </article>
  );
}

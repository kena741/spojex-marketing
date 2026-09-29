import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { MediaImage } from "@/components/media-image";
import { MiniStoreButtons } from "@/components/store-buttons";
import { PageHero } from "@/components/page-hero";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCatalog();
  return pageMetadata({
    title: "Mini Apps",
    description: `Mini apps inside the ${site.appName} super app.`,
    path: "/mini-apps",
  });
}

export default async function MiniAppsPage() {
  const { miniApps, site } = await getCatalog();
  return (
    <>
      <PageHero
        kicker="Mini apps"
        title="Everything you need. One super app."
        body={`Published partners inside ${site.appName}. Store buttons show only when a listing has them.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {miniApps.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {miniApps.map((app) => (
              <article key={app.id} className="rounded-[1.75rem] border border-line bg-white p-5">
                <div className="relative h-36 overflow-hidden rounded-2xl bg-pitch-deep">
                  <MediaImage src={app.logoUrl} alt="" />
                </div>
                <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-pitch uppercase">{app.category}</p>
                <h2 className="font-display mt-1 text-4xl leading-none font-semibold text-pitch-deep">{app.name}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{app.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link href={`/mini-apps/${app.slug}`} className="rounded-full bg-pitch px-4 py-2 text-sm font-semibold text-white">
                    Open
                  </Link>
                  <MiniStoreButtons appStoreUrl={app.appStoreUrl} playStoreUrl={app.playStoreUrl} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No published mini apps" body="The catalog is empty until Spojex publishes a mini app." />
        )}
      </section>
    </>
  );
}

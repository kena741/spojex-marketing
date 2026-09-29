import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { MediaImage } from "@/components/media-image";
import { PageHero } from "@/components/page-hero";
import { getCatalog } from "@/lib/catalog";
import { opportunityStatusLabel } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { ECOSYSTEM_ROLES, roleLabel } from "@/lib/roles";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Opportunities",
    description: "Player pathways, roles, and published opportunities on Spojex.",
    path: "/opportunities",
  });
}

export default async function OpportunitiesPage() {
  const { opportunities } = await getCatalog();
  return (
    <>
      <PageHero
        kicker="Opportunities"
        title="Find the next step in the game."
        body="Trials, roles, and pathways that are actually published in Spojex."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM_ROLES.map((role) => (
            <article key={role.id} className="rounded-3xl bg-white p-4">
              <h2 className="font-display text-3xl leading-none font-semibold text-pitch-deep">{role.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{role.blurb}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4">
          {opportunities.length ? (
            opportunities.map((item) => (
              <Link key={item.id} href={`/opportunities/${item.id}`} className="grid overflow-hidden rounded-[1.75rem] bg-white md:grid-cols-[240px_1fr]">
                <div className="relative min-h-44">
                  <MediaImage src={item.coverUrl} alt="" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-leaf uppercase">
                    {opportunityStatusLabel(item.status)} · {item.category}
                  </p>
                  <h2 className="font-display mt-2 text-4xl leading-none font-semibold text-pitch-deep">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted">
                    {[item.organizer, item.location, item.country].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-3 text-sm leading-6">{item.description}</p>
                  {item.roles.length ? (
                    <p className="mt-3 text-xs text-muted">{item.roles.map(roleLabel).join(" · ")}</p>
                  ) : null}
                </div>
              </Link>
            ))
          ) : (
            <EmptyState title="No public opportunities" body="Published opportunities will appear here." />
          )}
        </div>
      </section>
    </>
  );
}

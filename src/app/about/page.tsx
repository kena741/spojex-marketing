import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getCatalog } from "@/lib/catalog";
import { policyParagraphs } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { HOST_MODULES } from "@/lib/roles";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCatalog();
  return pageMetadata({
    title: "About",
    description: site.companyDescription,
    path: "/about",
  });
}

export default async function AboutPage() {
  const catalog = await getCatalog();
  const { site } = catalog;
  const about = site.about || site.companyDescription;
  return (
    <>
      <PageHero kicker="About" title={site.appName} body={site.companyDescription} />
      <section className="mx-auto max-w-3xl space-y-5 px-4 py-12 text-base leading-7 sm:px-6">
        {policyParagraphs(about).map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <p>
          The public catalog currently includes {catalog.miniApps.length} mini{" "}
          {catalog.miniApps.length === 1 ? "app" : "apps"}, {catalog.events.length} events,{" "}
          {catalog.news.length} stories, and {catalog.opportunities.length} published{" "}
          {catalog.opportunities.length === 1 ? "opportunity" : "opportunities"}.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {HOST_MODULES.map((module) => (
            <li key={module.name} className="rounded-2xl bg-white p-4">
              <p className="font-semibold">{module.name}</p>
              <p className="text-sm text-muted">{module.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

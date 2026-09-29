import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Contact",
    description: "Contact Spojex support.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const { site } = await getCatalog();
  return (
    <>
      <PageHero kicker="Contact" title="Talk to Spojex." body="Support details come from Spojex global settings." />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div className="space-y-3 text-base">
          {site.address ? <p>{site.address}</p> : null}
          {site.email ? (
            <p>
              <a className="font-semibold text-pitch" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          ) : (
            <p className="text-muted">A public contact email has not been published yet.</p>
          )}
          {site.phone ? <p>{site.phone}</p> : null}
          {site.supportUrl ? (
            <p>
              <a href={site.supportUrl} className="font-semibold text-pitch" target="_blank" rel="noopener noreferrer">
                Support site
              </a>
            </p>
          ) : null}
        </div>
        {site.email ? <ContactForm email={site.email} subject={site.emailSubject} /> : null}
      </section>
    </>
  );
}

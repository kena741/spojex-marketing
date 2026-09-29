import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { MediaImage } from "@/components/media-image";
import { PageHero } from "@/components/page-hero";
import { getCatalog } from "@/lib/catalog";
import { formatMoney, formatWhen } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Events",
    description: "Public sports events and tickets on Spojex.",
    path: "/events",
  });
}

export default async function EventsPage() {
  const { events } = await getCatalog();
  const upcoming = events.filter((event) => event.timing === "upcoming" || event.timing === "today");
  const list = upcoming.length ? upcoming : events;
  return (
    <>
      <PageHero
        kicker="Events"
        title={upcoming.length ? "Upcoming events" : "Events"}
        body={
          upcoming.length
            ? "Dates, venues, and ticket prices from public Spojex listings."
            : "No upcoming public events right now. Recent public listings are shown below."
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {list.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="overflow-hidden rounded-[1.75rem] bg-white">
                <div className="relative h-52">
                  <MediaImage src={event.imageUrl} alt="" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-pitch uppercase">{event.timing}</p>
                  <h2 className="font-display mt-2 text-4xl leading-none font-semibold text-pitch-deep">{event.name}</h2>
                  <p className="mt-2 text-sm text-muted">
                    {formatWhen(event.startsAt)}
                    {event.location ? ` · ${event.location}` : ""}
                    {event.venue ? ` · ${event.venue}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-6">{event.description}</p>
                  <p className="mt-3 font-semibold text-pitch">{formatMoney(event.ticketPrice, event.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No public events" body="Active events will appear here when Spojex publishes them." />
        )}
      </section>
    </>
  );
}

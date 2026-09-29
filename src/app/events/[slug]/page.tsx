import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MediaImage } from "@/components/media-image";
import { findBySlug, getCatalog } from "@/lib/catalog";
import { formatMoney, formatWhen } from "@/lib/format";
import { isPublicKey } from "@/lib/keys";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPublicKey(slug)) notFound();
  const { events } = await getCatalog();
  const event = findBySlug(events, slug);
  if (!event) notFound();
  return pageMetadata({
    title: event.name,
    description: event.description,
    path: `/events/${event.slug}`,
    image: event.imageUrl,
  });
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  if (!isPublicKey(slug)) notFound();
  const { events } = await getCatalog();
  const event = findBySlug(events, slug);
  if (!event) notFound();
  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: event.name,
          description: event.description,
          startDate: event.startsAt,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: event.venue || event.location || "Venue",
            address: event.location,
          },
          offers: {
            "@type": "Offer",
            price: event.ticketPrice,
            priceCurrency: event.currency,
            url: absoluteUrl(`/events/${event.slug}`),
          },
          image: event.imageUrl || undefined,
        }}
      />
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-pitch uppercase">{event.timing}</p>
        <h1 className="font-display mt-2 text-6xl leading-[0.9] font-semibold text-pitch-deep">{event.name}</h1>
        <p className="mt-4 text-muted">
          {formatWhen(event.startsAt)}
          {event.venue ? ` · ${event.venue}` : ""}
          {event.location ? ` · ${event.location}` : ""}
        </p>
        <p className="mt-6 text-lg leading-8">{event.description}</p>
        <p className="mt-6 text-sm font-semibold">Tickets {formatMoney(event.ticketPrice, event.currency)}</p>
        <Link href="/#download" className="mt-6 inline-flex rounded-full bg-gold px-5 py-3 text-sm font-semibold text-pitch-ink">
          Get tickets in Spojex
        </Link>
      </div>
      <div className="relative min-h-80 overflow-hidden rounded-[2rem]">
        <MediaImage src={event.imageUrl} alt={event.name} priority />
      </div>
    </article>
  );
}

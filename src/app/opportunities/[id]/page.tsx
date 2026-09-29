import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/media-image";
import { getCatalog } from "@/lib/catalog";
import { formatMoney, formatWhen, opportunityStatusLabel } from "@/lib/format";
import { isPublicKey } from "@/lib/keys";
import { roleLabel } from "@/lib/roles";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isPublicKey(id)) notFound();
  const { opportunities } = await getCatalog();
  const item = opportunities.find((entry) => entry.id === id);
  if (!item) notFound();
  return pageMetadata({
    title: item.title,
    description: item.description,
    path: `/opportunities/${item.id}`,
    image: item.coverUrl,
  });
}

export default async function OpportunityPage({ params }: Props) {
  const { id } = await params;
  if (!isPublicKey(id)) notFound();
  const { opportunities } = await getCatalog();
  const item = opportunities.find((entry) => entry.id === id);
  if (!item) notFound();
  const fee = item.feeType === "free" || !item.feeAmount ? "Free" : formatMoney(item.feeAmount, "ETB");
  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-leaf uppercase">
          {opportunityStatusLabel(item.status)} · {item.category}
        </p>
        <h1 className="font-display mt-2 text-6xl leading-[0.9] font-semibold text-pitch-deep">{item.title}</h1>
        <p className="mt-4 text-muted">
          {[item.organizer, item.location, item.country].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-6 text-lg leading-8">{item.description}</p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4">
            <dt className="text-muted">Fee</dt>
            <dd className="font-semibold">{fee}</dd>
          </div>
          {item.deadline ? (
            <div className="rounded-2xl bg-white p-4">
              <dt className="text-muted">Deadline</dt>
              <dd className="font-semibold">{formatWhen(item.deadline)}</dd>
            </div>
          ) : null}
          {item.startDate ? (
            <div className="rounded-2xl bg-white p-4">
              <dt className="text-muted">Starts</dt>
              <dd className="font-semibold">{formatWhen(item.startDate)}</dd>
            </div>
          ) : null}
        </dl>
        {item.roles.length ? (
          <p className="mt-4 text-sm">Open to {item.roles.map(roleLabel).join(", ")}.</p>
        ) : null}
        {item.eligibility ? <p className="mt-4 text-sm leading-6">{item.eligibility}</p> : null}
        {item.documents ? <p className="mt-3 text-sm leading-6">{item.documents}</p> : null}
        {item.terms ? <p className="mt-3 text-sm leading-6 text-muted">{item.terms}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {item.externalUrl ? (
            <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-pitch px-5 py-3 text-sm font-semibold text-white">
              External link
            </a>
          ) : null}
          <Link href="/#download" className="rounded-full border border-pitch px-5 py-3 text-sm font-semibold text-pitch">
            Continue in the app
          </Link>
        </div>
      </div>
      <div className="relative min-h-80 overflow-hidden rounded-[2rem]">
        <MediaImage src={item.coverUrl} alt={item.title} priority />
      </div>
    </article>
  );
}

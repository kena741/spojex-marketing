import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VoteLanding } from "@/components/vote-landing";
import { getCatalog } from "@/lib/catalog";
import { getApiBaseUrl } from "@/lib/env";
import { isAppContentId } from "@/lib/keys";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

type Nominee = { name: string; photoUrl: string; eventTitle: string };

/** Public nominee summary (the awards read API allows guests). */
async function loadNominee(id: string): Promise<Nominee | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/awards/participants/${encodeURIComponent(id)}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      participant?: { name?: string; photo_url?: string };
      event?: { title?: string };
    };
    return {
      name: data.participant?.name?.trim() || "this nominee",
      photoUrl: data.participant?.photo_url?.trim() || "",
      eventTitle: data.event?.title?.trim() || "Spojex Awards",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isAppContentId(id)) notFound();
  const nominee = await loadNominee(id);
  return pageMetadata({
    title: nominee ? `Vote for ${nominee.name}` : "Vote on Spojex",
    description: nominee
      ? `${nominee.name} is nominated in ${nominee.eventTitle}. Open Spojex to vote.`
      : "Open Spojex to vote for this nominee.",
    path: `/vote/${encodeURIComponent(id)}`,
    image: nominee?.photoUrl || null,
  });
}

/**
 * Shared nominee voting link. With the app installed, iOS Universal Links and
 * Android App Links open the app before this page loads. Otherwise this page
 * sends people to the store; the store button copies the link first so the
 * app can open this nominee on its first launch.
 */
export default async function VotePage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  if (!isAppContentId(id)) notFound();
  const [{ site }, nominee] = await Promise.all([getCatalog(), loadNominee(id)]);
  return (
    <VoteLanding
      participantId={id}
      shareUrl={`https://www.spojex.com/vote/${encodeURIComponent(id)}`}
      appStoreUrl={site.appStoreUrl}
      playStoreUrl={site.playStoreUrl}
      nominee={nominee}
    />
  );
}

"use client";

import { useSyncExternalStore } from "react";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "other";
}

const noopSubscribe = () => () => {};

/** Copies the vote link so the freshly installed app can open this nominee. */
async function handOff(shareUrl: string) {
  try {
    await navigator.clipboard.writeText(shareUrl);
  } catch {
    // Clipboard blocked: the store still opens; the person can reopen the link.
  }
}

/** Play Store link carrying the vote link as the install referrer. */
function playWithReferrer(playStoreUrl: string, participantId: string) {
  const sep = playStoreUrl.includes("?") ? "&" : "?";
  return `${playStoreUrl}${sep}referrer=${encodeURIComponent(`vote=${participantId}`)}`;
}

export function VoteLanding({
  participantId,
  shareUrl,
  appStoreUrl,
  playStoreUrl,
  nominee,
}: {
  participantId: string;
  shareUrl: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  nominee: { name: string; photoUrl: string; eventTitle: string } | null;
}) {
  // "other" on the server, the real platform after hydration.
  const platform = useSyncExternalStore<Platform>(noopSubscribe, detectPlatform, () => "other");

  const play = playStoreUrl ? playWithReferrer(playStoreUrl, participantId) : null;
  const primary = platform === "ios" ? appStoreUrl : platform === "android" ? play : null;

  const go = async (url: string) => {
    await handOff(shareUrl);
    window.location.href = url;
  };

  const name = nominee?.name ?? "this nominee";
  const button =
    "inline-flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-semibold sm:w-auto";

  return (
    <section className="mx-auto max-w-xl px-4 py-14 text-center sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-pitch uppercase">
        {nominee?.eventTitle ?? "Spojex Awards"}
      </p>
      {nominee?.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={nominee.photoUrl}
          alt=""
          className="mx-auto mt-6 h-28 w-28 rounded-full object-cover ring-4 ring-pitch/10"
        />
      ) : null}
      <h1 className="font-display mt-5 text-4xl leading-tight font-semibold text-pitch-deep sm:text-5xl">
        Vote for {name}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Voting happens in the Spojex app. Get the app and it opens straight to {name}&apos;s page.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        {primary ? (
          <button type="button" onClick={() => go(primary)} className={`${button} bg-pitch-ink text-white hover:bg-pitch`}>
            Get Spojex to vote
          </button>
        ) : (
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            {appStoreUrl ? (
              <button type="button" onClick={() => go(appStoreUrl)} className={`${button} bg-pitch-ink text-white hover:bg-pitch`}>
                App Store
              </button>
            ) : null}
            {play ? (
              <button type="button" onClick={() => go(play)} className={`${button} bg-pitch-ink text-white hover:bg-pitch`}>
                Google Play
              </button>
            ) : null}
          </div>
        )}
        <a href={`spojex://vote/${encodeURIComponent(participantId)}`} className="text-sm font-semibold text-pitch underline">
          I already have Spojex — open the app
        </a>
      </div>
    </section>
  );
}

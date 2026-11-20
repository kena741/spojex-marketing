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

/** Copies the link so the freshly installed app can open it on first launch. */
async function handOff(shareUrl: string) {
  try {
    await navigator.clipboard.writeText(shareUrl);
  } catch {
    // Clipboard blocked: the store still opens; the person can reopen the link.
  }
}

function playWithReferrer(playStoreUrl: string, referrer: string) {
  const sep = playStoreUrl.includes("?") ? "&" : "?";
  return `${playStoreUrl}${sep}referrer=${encodeURIComponent(referrer)}`;
}

/**
 * Landing for a shared Marketplace product or store. With the app installed,
 * Universal Links / App Links open the app first; otherwise this sends people
 * to the store and hands the link to the app after install.
 */
export function MarketLanding({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  round,
  cta,
  deepLink,
  shareUrl,
  referrer,
  appStoreUrl,
  playStoreUrl,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  round?: boolean;
  cta: string;
  deepLink: string;
  shareUrl: string;
  referrer: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
}) {
  const platform = useSyncExternalStore<Platform>(noopSubscribe, detectPlatform, () => "other");
  const play = playStoreUrl ? playWithReferrer(playStoreUrl, referrer) : null;
  const primary = platform === "ios" ? appStoreUrl : platform === "android" ? play : null;

  const go = async (url: string) => {
    await handOff(shareUrl);
    window.location.href = url;
  };

  const button =
    "inline-flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-semibold sm:w-auto";

  return (
    <section className="mx-auto max-w-xl px-4 py-14 text-center sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-pitch uppercase">{eyebrow}</p>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className={
            round
              ? "mx-auto mt-6 h-28 w-28 rounded-full object-cover ring-4 ring-pitch/10"
              : "mx-auto mt-6 aspect-square w-full max-w-xs rounded-3xl object-cover ring-1 ring-pitch/10"
          }
        />
      ) : null}
      <h1 className="font-display mt-5 text-4xl leading-tight font-semibold text-pitch-deep sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-muted">{subtitle}</p>

      <div className="mt-8 flex flex-col items-center gap-3">
        {primary ? (
          <button type="button" onClick={() => go(primary)} className={`${button} bg-pitch-ink text-white hover:bg-pitch`}>
            {cta}
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
        <a href={deepLink} className="text-sm font-semibold text-pitch underline">
          I already have Spojex — open the app
        </a>
      </div>
    </section>
  );
}

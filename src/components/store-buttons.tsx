import type { PublicSite } from "@/lib/catalog";

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.8-.7c-1.5.1-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7 1.9-1.1 2.6-2.2c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.8-2.2-3.6zM14.7 6.2c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 1.9-.5 2.5-1.2z"
      />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#34a853" d="M3.5 20.5 14.2 12 3.5 3.5v17z" />
      <path fill="#fbbc04" d="M14.2 12 17.5 9.4 5.2 2.2 14.2 12z" />
      <path fill="#ea4335" d="M3.5 20.5 14.2 12l3.3 2.6L5.2 21.8 3.5 20.5z" />
      <path fill="#4285f4" d="M17.5 14.6 14.2 12l3.3-2.6 2.4 1.4c.8.5.8 1.6 0 2.1l-2.4 1.7z" />
    </svg>
  );
}

export function StoreButtons({
  site,
  className = "",
  tone = "light",
}: {
  site: Pick<PublicSite, "appStoreUrl" | "playStoreUrl" | "appName">;
  className?: string;
  tone?: "light" | "dark";
}) {
  if (!site.appStoreUrl && !site.playStoreUrl) return null;
  const button =
    tone === "light"
      ? "bg-white text-pitch-ink hover:bg-gold"
      : "bg-pitch-ink text-white hover:bg-pitch";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {site.appStoreUrl ? (
        <a
          href={site.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-12 items-center gap-3 rounded-full px-4 pr-5 text-left ${button}`}
        >
          <AppleMark />
          <span>
            <span className="block text-[10px] uppercase tracking-[0.16em]">Download on the</span>
            <span className="font-display block text-lg leading-none font-semibold">App Store</span>
          </span>
          <span className="sr-only"> for {site.appName}</span>
        </a>
      ) : null}
      {site.playStoreUrl ? (
        <a
          href={site.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-12 items-center gap-3 rounded-full px-4 pr-5 text-left ${button}`}
        >
          <PlayMark />
          <span>
            <span className="block text-[10px] uppercase tracking-[0.16em]">Get it on</span>
            <span className="font-display block text-lg leading-none font-semibold">Google Play</span>
          </span>
        </a>
      ) : null}
    </div>
  );
}

export function MiniStoreButtons({
  appStoreUrl,
  playStoreUrl,
}: {
  appStoreUrl: string | null;
  playStoreUrl: string | null;
}) {
  if (!appStoreUrl && !playStoreUrl) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {appStoreUrl ? (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-pitch-ink px-3 py-1.5 text-xs font-semibold text-white"
        >
          App Store
        </a>
      ) : null}
      {playStoreUrl ? (
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-pitch-ink px-3 py-1.5 text-xs font-semibold text-white"
        >
          Google Play
        </a>
      ) : null}
    </div>
  );
}

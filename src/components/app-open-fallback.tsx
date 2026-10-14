import { StoreButtons } from "@/components/store-buttons";
import type { PublicSite } from "@/lib/catalog";

/** Web landing when a share / App Link opens without the native app. */
export function AppOpenFallback({
  site,
  title,
  description,
  deepLinkHint,
}: {
  site: Pick<PublicSite, "appStoreUrl" | "playStoreUrl" | "appName" | "email">;
  title: string;
  description: string;
  deepLinkHint?: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-pitch uppercase">Open in Spojex</p>
      <h1 className="font-display mt-3 text-4xl leading-none font-semibold text-pitch-deep sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">{description}</p>
      {deepLinkHint ? (
        <p className="mt-3 rounded-2xl bg-pitch/5 px-4 py-3 font-mono text-xs break-all text-pitch-ink/80">
          {deepLinkHint}
        </p>
      ) : null}
      <div className="mt-8">
        <StoreButtons site={site} tone="dark" />
        {!site.appStoreUrl && !site.playStoreUrl ? (
          <p className="mt-4 text-sm text-muted">
            Store listings are not published yet.
            {site.email ? ` Contact ${site.email} for access.` : ""} Once you install Spojex, open this
            link again to jump to the content.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Install Spojex, then open this link again. We do not restore the destination automatically
            after install.
          </p>
        )}
      </div>
    </section>
  );
}

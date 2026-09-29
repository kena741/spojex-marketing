import Link from "next/link";
import type { PublicSite } from "@/lib/catalog";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/mini-apps", label: "Mini Apps" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function SiteFooter({ site }: { site: PublicSite }) {
  const year = new Date().getFullYear();
  const downloads = [
    site.appStoreUrl ? { href: site.appStoreUrl, label: "App Store" } : null,
    site.playStoreUrl ? { href: site.playStoreUrl, label: "Google Play" } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <footer className="mt-auto bg-pitch-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.logoUrl || "/brand/sj-mark.png"}
              alt=""
              className="h-11 w-11 rounded-2xl object-cover"
            />
            <p className="font-display text-3xl leading-none font-semibold">{site.appName}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            {site.companyDescription}
          </p>
          <div className="mt-5 space-y-1 text-sm text-white/70">
            {site.address ? <p>{site.address}</p> : null}
            {site.email ? (
              <p>
                <a className="hover:text-gold" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            ) : null}
            {site.phone ? <p>{site.phone}</p> : null}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {EXPLORE.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {LEGAL.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {downloads.length ? (
            <>
              <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                Download
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {downloads.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {site.socials.length ? (
            <div className={downloads.length ? "mt-8" : ""}>
              <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Social</p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {site.socials.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50 sm:px-6">
          © {year} {site.appName}. Sports, together.
        </p>
      </div>
    </footer>
  );
}

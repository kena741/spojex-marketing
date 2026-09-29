"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { PublicSite } from "@/lib/catalog";

type HeaderSite = Pick<PublicSite, "appName" | "logoUrl">;

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/mini-apps", label: "Mini Apps" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ site }: { site: HeaderSite }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  return (
    <header className="relative sticky top-0 z-40 border-b border-white/10 bg-pitch-ink text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.logoUrl || "/brand/sj-mark.png"}
            alt=""
            className="h-9 w-9 rounded-xl object-cover"
          />
          <span className="font-display text-2xl leading-none font-semibold tracking-wide">
            {site.appName}
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-white/80 lg:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/#download"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-pitch-ink sm:inline-flex"
          >
            Download App
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden>
              <span className="h-0.5 bg-white" />
              <span className="h-0.5 bg-white" />
              <span className="h-0.5 bg-white" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="absolute inset-x-0 top-16 border-t border-white/10 bg-pitch-ink px-4 py-4 shadow-2xl lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#download"
              className="mt-2 rounded-full bg-gold px-4 py-3 text-center font-semibold text-pitch-ink"
            >
              Download App
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

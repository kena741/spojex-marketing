import type { Metadata } from "next";
import { Barlow_Condensed, Noto_Sans_Ethiopic, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const ethiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "600", "700"],
  variable: "--font-ethiopic",
});

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/" });
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { site } = await getCatalog();
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${display.variable} ${ethiopic.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader site={site} />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}

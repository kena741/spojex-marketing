import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Cookie Policy",
    description: "How the Spojex website uses cookies.",
    path: "/cookie-policy",
  });
}

export default async function CookiePage() {
  const { site } = await getCatalog();
  return <LegalDocument kicker="Legal" title="Cookie Policy" body={site.cookiePolicy} />;
}

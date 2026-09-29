import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Privacy Policy",
    description: "How Spojex handles personal information.",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPage() {
  const { site } = await getCatalog();
  return <LegalDocument kicker="Legal" title="Privacy Policy" body={site.privacyPolicy} />;
}

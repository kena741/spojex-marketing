import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Community Guidelines",
    description: "How to take part in the Spojex community.",
    path: "/community-guidelines",
  });
}

export default async function GuidelinesPage() {
  const { site } = await getCatalog();
  return (
    <LegalDocument kicker="Legal" title="Community Guidelines" body={site.communityGuidelines} />
  );
}

import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Refund Policy",
    description: "Refunds and cancellations for Spojex payments.",
    path: "/refund-policy",
  });
}

export default async function RefundPage() {
  const { site } = await getCatalog();
  return <LegalDocument kicker="Legal" title="Refund Policy" body={site.refundPolicy} />;
}

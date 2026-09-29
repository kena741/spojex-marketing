import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Terms & Conditions",
    description: "Terms for using Spojex.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const { site } = await getCatalog();
  return (
    <>
      <LegalDocument kicker="Legal" title="Terms & Conditions" body={site.terms} />
      <p className="mx-auto max-w-3xl px-4 pb-12 text-sm sm:px-6">
        <Link href="/refund-policy" className="font-semibold text-pitch">
          Refund and cancellation policy
        </Link>
      </p>
    </>
  );
}

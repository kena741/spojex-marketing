import { policyParagraphs, sanitizePolicyHtml } from "@/lib/legal";
import { PageHero } from "@/components/page-hero";

export function LegalDocument({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  const html = sanitizePolicyHtml(body);
  const paragraphs = html ? [] : policyParagraphs(body);
  return (
    <>
      <PageHero kicker={kicker} title={title} body="Published for the Spojex community." />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {html ? (
          <div className="policy-html" dangerouslySetInnerHTML={{ __html: html }} />
        ) : paragraphs.length ? (
          <div className="space-y-5 text-base leading-7 text-ink/90">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-muted">This document has not been published yet.</p>
        )}
      </article>
    </>
  );
}

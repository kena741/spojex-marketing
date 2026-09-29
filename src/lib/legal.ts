/**
 * Plain-text fallbacks used by the Spojex app when Global Settings policies
 * are empty. See spojex_feature_auth legal_document_screen.dart.
 * Cookie, community, and refund text follows those same in-app rules.
 */
export const FALLBACK_TERMS = `Spojex Terms of Service

By using Spojex you agree to use the app lawfully and respectfully. You are responsible for the accuracy of information you provide and for keeping your account secure.

You may not harass others, upload illegal content, or misuse Spojex features. We may suspend accounts that violate these terms.

Payments for tickets, donations, gym memberships, or services are processed by third-party providers subject to their terms. Spojex is not liable for third-party failures beyond our reasonable control.

These terms may be updated. Continued use after updates means you accept the revised terms. For questions, contact Spojex support through the channels published on our website or in-app.`;

export const FALLBACK_PRIVACY = `Spojex Privacy Policy

Spojex collects account information you provide (such as name, email, phone, and profile details), content you upload (photos, videos, messages), and technical data needed to operate the app (device identifiers for push notifications, usage needed for security and performance).

We use this data to provide Spojex features: profiles, chat, bookings, gym management, donations, tickets, and notifications. We do not sell your personal information.

Data is stored with our service providers (including hosting and authentication). Access is limited to what is needed to run Spojex.

You can update profile information in the app. You can request account deletion from Profile → Delete account. After deletion, your public profile is removed from discovery and personal fields are anonymized.

For privacy questions or data requests, contact Spojex support through the channels published on our website or in-app.`;

export const FALLBACK_COOKIE = `This website stores only what it needs to load pages reliably. Spojex does not sell personal information.

The Spojex app may use device identifiers to deliver push notifications, as described in the Privacy Policy. Third-party pages opened from Spojex, including payment providers, use their own cookies and policies.`;

export const FALLBACK_COMMUNITY = `Spojex is for athletes, fans, coaches, scouts, agents, academies, and clubs. Use the app lawfully and respectfully.

Do not harass others, upload illegal content, or misuse bookings, tickets, donations, chat, or profiles. We may suspend accounts that violate these guidelines or the Terms of Service.`;

export const FALLBACK_REFUND = `Payments for tickets, donations, gym memberships, and services are processed by third-party providers. Refunds follow the event, campaign, or service terms shown before you pay.

If a payment does not complete, contact Spojex support with the details published on this website.`;

export const FALLBACK_HERO = {
  eyebrow: "Ethiopia's sports super app",
  headline: "One Super App. Everything Sports.",
  description:
    "Connect with opportunities, discover events, follow sports content, connect with the community, and access the growing Spojex sports ecosystem from one app.",
};

/** Same HTML-to-text pass the Spojex app uses for policies stored in settings. */
export function policyToPlain(raw: string) {
  let text = raw.trim();
  if (!text) return "";
  text = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<\/div\s*>/gi, "\n")
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

export function policyParagraphs(raw: string) {
  return policyToPlain(raw)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

const POLICY_TAGS = new Set(["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "br"]);

/** Keep a small set of tags so Global Settings HTML can render safely. */
export function sanitizePolicyHtml(raw: string) {
  const trimmed = raw.trim();
  if (!/<\/?[a-z][\s\S]*>/i.test(trimmed)) return null;
  const withoutActive = trimmed
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const html = withoutActive.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag: string, attrs: string) => {
    const name = tag.toLowerCase();
    if (!POLICY_TAGS.has(name)) return "";
    if (match.startsWith("</")) return name === "br" ? "" : `</${name}>`;
    if (name === "br") return "<br>";
    if (name !== "a") return `<${name}>`;
    const hrefMatch = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attrs);
    const href = (hrefMatch?.[1] || hrefMatch?.[2] || "").trim();
    const safe = href.startsWith("https://") || href.startsWith("mailto:") ? href : "";
    if (!safe) return "<a>";
    return `<a href="${safe.replace(/"/g, "")}" rel="noopener noreferrer">`;
  });
  const cleaned = html.trim();
  return cleaned || null;
}

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";
import { clip, eventTiming } from "@/lib/format";
import {
  FALLBACK_COMMUNITY,
  FALLBACK_COOKIE,
  FALLBACK_HERO,
  FALLBACK_PRIVACY,
  FALLBACK_REFUND,
  FALLBACK_TERMS,
  policyToPlain,
} from "@/lib/legal";
import { isAppStoreUrl, isPlayStoreUrl, safeAppLink, safeHttpsUrl } from "@/lib/safe-url";

type Row = Record<string, unknown>;

export type MiniApp = {
  id: string;
  slug: string;
  name: string;
  partner: string;
  summary: string;
  description: string;
  category: string;
  icon: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  deepLink: string | null;
  features: string[];
  screenshots: string[];
  status: "published";
  sortOrder: number;
};

export type SportEvent = {
  id: string;
  slug: string;
  name: string;
  venue: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  ticketPrice: number;
  currency: string;
  imageUrl: string | null;
  description: string;
  timing: "upcoming" | "today" | "past" | "scheduled";
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  source: string;
  imageUrl: string | null;
  publishedAt: string | null;
  featured: boolean;
};

export type RadioStation = {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  city: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  featured: boolean;
};

export type LiveMatch = {
  id: string;
  name: string;
  kind: string;
  status: string;
  startsAt: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  description: string;
  imageUrl: string | null;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  category: string;
  organizer: string;
  location: string;
  country: string;
  coverUrl: string | null;
  status: string;
  feeType: string;
  feeAmount: number;
  deadline: string | null;
  startDate: string | null;
  externalUrl: string | null;
  eligibility: string;
  documents: string;
  terms: string;
  roles: string[];
};

export type Donation = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  goalAmount: number;
  currency: string;
};

export type SocialLink = { id: string; label: string; href: string };

export type PublicSite = {
  appName: string;
  appColor: string;
  version: string;
  eyebrow: string;
  headline: string;
  description: string;
  about: string;
  companyDescription: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  email: string | null;
  phone: string | null;
  address: string | null;
  emailSubject: string;
  supportUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  logoUrl: string | null;
  socials: SocialLink[];
  privacyPolicy: string;
  terms: string;
  cookiePolicy: string;
  communityGuidelines: string;
  refundPolicy: string;
  degraded: boolean;
};

export type Catalog = {
  site: PublicSite;
  miniApps: MiniApp[];
  events: SportEvent[];
  news: NewsArticle[];
  radio: RadioStation[];
  live: LiveMatch[];
  opportunities: Opportunity[];
  donations: Donation[];
};

const SOCIAL_FIELDS: Array<{ key: string; label: string }> = [
  { key: "social_instagram", label: "Instagram" },
  { key: "social_facebook", label: "Facebook" },
  { key: "social_x", label: "X" },
  { key: "social_tiktok", label: "TikTok" },
  { key: "social_youtube", label: "YouTube" },
  { key: "social_telegram", label: "Telegram" },
  { key: "social_linkedin", label: "LinkedIn" },
];

function text(value: unknown) {
  return `${value ?? ""}`.trim();
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

function imageList(value: unknown) {
  return stringList(value)
    .map((item) => safeHttpsUrl(item))
    .filter((item): item is string => Boolean(item))
    .slice(0, 6);
}

function firstText(row: Row, keys: string[]) {
  for (const key of keys) {
    const value = text(row[key]);
    if (value) return value;
  }
  return "";
}

function classifyExternal(url: string | null) {
  if (!url) return { website: null as string | null, appStore: null as string | null, play: null as string | null };
  if (isAppStoreUrl(url)) return { website: null, appStore: url, play: null };
  if (isPlayStoreUrl(url)) return { website: null, appStore: null, play: url };
  return { website: url, appStore: null, play: null };
}

function mapMiniApp(row: Row): MiniApp | null {
  const name = text(row.name);
  const slug = text(row.slug) || text(row.id);
  if (!name || !slug) return null;
  const external = classifyExternal(safeHttpsUrl(row.url));
  const appStore =
    safeHttpsUrl(row.app_store_url) ||
    safeHttpsUrl(row.ios_url) ||
    external.appStore;
  const playStore =
    safeHttpsUrl(row.play_store_url) ||
    safeHttpsUrl(row.android_url) ||
    external.play;
  const description = firstText(row, ["description", "full_description", "summary"]);
  return {
    id: text(row.id),
    slug,
    name,
    partner: text(row.partner),
    summary: text(row.summary) || description,
    description: description || text(row.summary),
    category: text(row.category) || "Services",
    icon: text(row.icon) || "apps",
    logoUrl: safeHttpsUrl(row.logo_url) || safeHttpsUrl(row.icon_url),
    websiteUrl: external.website,
    appStoreUrl: appStore,
    playStoreUrl: playStore,
    deepLink: safeAppLink(row.deep_link) || safeAppLink(row.app_link),
    features: stringList(row.features ?? row.key_features),
    screenshots: imageList(row.screenshots ?? row.images),
    status: "published",
    sortOrder: Number(row.sort_order) || 0,
  };
}

function mapEvent(row: Row): SportEvent | null {
  const name = text(row.name);
  const startsAt = text(row.starts_at);
  if (!name || !startsAt) return null;
  const photos = imageList(row.photos);
  return {
    id: text(row.id),
    slug: text(row.slug) || text(row.id),
    name,
    venue: text(row.venue_name),
    location: text(row.location),
    startsAt,
    endsAt: text(row.ends_at) || null,
    ticketPrice: Number(row.ticket_price) || 0,
    currency: text(row.currency) || "ETB",
    imageUrl: safeHttpsUrl(row.image_url) || photos[0] || null,
    description: text(row.description),
    timing: eventTiming(startsAt),
  };
}

function mapNews(row: Row): NewsArticle | null {
  const title = text(row.title);
  const id = text(row.id);
  if (!title || !id) return null;
  return {
    id,
    slug: text(row.slug) || id,
    title,
    summary: text(row.summary),
    body: text(row.body),
    category: text(row.category) || "General",
    source: text(row.source),
    imageUrl: safeHttpsUrl(row.cover_url) || safeHttpsUrl(row.image_url),
    publishedAt: text(row.published_at) || null,
    featured: row.is_featured === true,
  };
}

function mapRadio(row: Row): RadioStation | null {
  const name = text(row.name);
  if (!name) return null;
  return {
    id: text(row.id),
    name,
    tagline: text(row.tagline),
    genre: text(row.genre),
    city: text(row.city),
    imageUrl: safeHttpsUrl(row.image_url),
    websiteUrl: safeHttpsUrl(row.website_url),
    featured: row.is_featured === true,
  };
}

function mapLive(row: Row): LiveMatch | null {
  const name = text(row.name);
  if (!name) return null;
  return {
    id: text(row.id),
    name,
    kind: text(row.kind) || "stream",
    status: text(row.status),
    startsAt: text(row.starts_at),
    homeName: text(row.home_name),
    awayName: text(row.away_name),
    homeScore: Number(row.home_score) || 0,
    awayScore: Number(row.away_score) || 0,
    description: text(row.description),
    imageUrl: safeHttpsUrl(row.thumbnail_url),
  };
}

function mapOpportunity(row: Row): Opportunity | null {
  const title = text(row.title);
  const id = text(row.id);
  if (!title || !id || row.is_published === false) return null;
  const roles = Array.isArray(row.eligible_roles)
    ? row.eligible_roles.map((role) => text(role)).filter(Boolean)
    : [];
  return {
    id,
    title,
    description: text(row.description) || text(row.short_description),
    category: text(row.category) || "General",
    organizer: text(row.organizer),
    location: text(row.location) || text(row.city),
    country: text(row.country),
    coverUrl: safeHttpsUrl(row.cover_image_url) || safeHttpsUrl(row.image_url),
    status: text(row.status) || "closed",
    feeType: text(row.fee_type) || "free",
    feeAmount: Number(row.fee_amount) || 0,
    deadline: text(row.application_deadline) || null,
    startDate: text(row.start_date) || null,
    externalUrl: safeHttpsUrl(row.external_link),
    eligibility: text(row.eligibility_requirements),
    documents: text(row.required_documents),
    terms: text(row.additional_terms),
    roles,
  };
}

function mapDonation(row: Row): Donation | null {
  const title = text(row.title);
  if (!title) return null;
  return {
    id: text(row.id),
    title,
    summary: text(row.summary) || text(row.description),
    imageUrl: safeHttpsUrl(row.cover_url) || safeHttpsUrl(row.image_url),
    goalAmount: Number(row.goal_amount) || 0,
    currency: text(row.currency) || "ETB",
  };
}

function asObject(value: unknown): Row {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Row;
}

function pick(source: Row, keys: string[]) {
  const next: Row = {};
  for (const key of keys) {
    if (key in source) next[key] = source[key];
  }
  return next;
}

function settingValue(map: Map<string, string>, key: string) {
  return (map.get(key) || "").trim();
}

function keywordsFrom(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 16);
}

function buildSite(
  settingsRows: Array<{ id: string; data: unknown }>,
  marketingRows: Array<{ key: string; value: string | null }>,
  degraded: boolean,
): PublicSite {
  const byId = new Map(settingsRows.map((row) => [row.id, asObject(row.data)]));
  const settings = pick(byId.get("settings") ?? {}, [
    "appName",
    "appColor",
    "appVersion",
    "aboutApp",
    "aboutAppSpojex",
    "supportURL",
    "phoneNumber",
    "supportEmail",
  ]);
  const policy = pick(byId.get("policy") ?? {}, [
    "privacyPolicy",
    "termsAndConditions",
    "aboutApp",
    "aboutAppSpojex",
    "cookiePolicy",
    "communityGuidelines",
    "refundPolicy",
  ]);
  const contact = pick(byId.get("contact_us") ?? {}, [
    "email",
    "phoneNumber",
    "address",
    "emailSubject",
  ]);
  const marketing = new Map(
    marketingRows.map((row) => [text(row.key), text(row.value)]),
  );

  const appName = text(settings.appName) || "Spojex";
  const about =
    policyToPlain(text(policy.aboutApp) || text(policy.aboutAppSpojex)) ||
    policyToPlain(text(settings.aboutApp) || text(settings.aboutAppSpojex)) ||
    policyToPlain(settingValue(marketing, "company_description"));

  const privacy =
    text(policy.privacyPolicy) ||
    text(settings.privacyPolicy) ||
    settingValue(marketing, "privacy_policy") ||
    FALLBACK_PRIVACY;
  const terms =
    text(policy.termsAndConditions) ||
    text(settings.termsAndConditions) ||
    settingValue(marketing, "terms") ||
    FALLBACK_TERMS;

  const socials = SOCIAL_FIELDS.flatMap((field) => {
    const href = safeHttpsUrl(settingValue(marketing, field.key));
    return href ? [{ id: field.key, label: field.label, href }] : [];
  });

  const headline =
    settingValue(marketing, "hero_headline") || FALLBACK_HERO.headline;
  const description =
    settingValue(marketing, "hero_description") ||
    clip(about, 220) ||
    FALLBACK_HERO.description;

  return {
    appName,
    appColor: /^#[0-9a-fA-F]{6}$/.test(text(settings.appColor))
      ? text(settings.appColor)
      : "#0A2463",
    version: text(settings.appVersion),
    eyebrow: FALLBACK_HERO.eyebrow,
    headline,
    description,
    about,
    companyDescription:
      settingValue(marketing, "company_description") ||
      clip(about, 180) ||
      "Spojex brings sports services, opportunities, events, and community content into one super app for Ethiopia.",
    seoTitle:
      settingValue(marketing, "seo_title") ||
      `${appName} — ${headline}`,
    seoDescription:
      settingValue(marketing, "seo_description") || clip(description, 180),
    keywords: keywordsFrom(
      settingValue(marketing, "seo_keywords") ||
        "Spojex, sports super app, Ethiopian football, events, opportunities",
    ),
    email: text(contact.email) || text(settings.supportEmail) || null,
    phone: text(contact.phoneNumber) || text(settings.phoneNumber) || null,
    address: text(contact.address) || null,
    emailSubject: text(contact.emailSubject) || `${appName} support`,
    supportUrl: safeHttpsUrl(settings.supportURL),
    appStoreUrl: safeHttpsUrl(settingValue(marketing, "app_store_url")),
    playStoreUrl: safeHttpsUrl(settingValue(marketing, "play_store_url")),
    logoUrl: safeHttpsUrl(settingValue(marketing, "logo_url")),
    socials,
    privacyPolicy: privacy,
    terms,
    cookiePolicy:
      text(policy.cookiePolicy) ||
      settingValue(marketing, "cookie_policy") ||
      FALLBACK_COOKIE,
    communityGuidelines:
      text(policy.communityGuidelines) ||
      settingValue(marketing, "community_guidelines") ||
      FALLBACK_COMMUNITY,
    refundPolicy:
      text(policy.refundPolicy) ||
      settingValue(marketing, "refund_policy") ||
      FALLBACK_REFUND,
    degraded,
  };
}

function emptySite(degraded: boolean): PublicSite {
  return buildSite([], [], degraded);
}

async function rowsOf(
  run: () => PromiseLike<{ data: unknown; error: { message: string } | null }>,
) {
  try {
    const { data, error } = await run();
    if (error) return { rows: [] as Row[], failed: true };
    return {
      rows: (Array.isArray(data) ? data : []) as Row[],
      failed: false,
    };
  } catch {
    return { rows: [] as Row[], failed: true };
  }
}

async function loadCatalog(): Promise<Catalog> {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) {
    return {
      site: emptySite(true),
      miniApps: [],
      events: [],
      news: [],
      radio: [],
      live: [],
      opportunities: [],
      donations: [],
    };
  }

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 60 } }),
    },
  });

  const [
    mini,
    events,
    news,
    radio,
    live,
    opportunities,
    donations,
    settings,
    marketing,
  ] = await Promise.all([
    rowsOf(() =>
      client
        .from("mini_apps")
        .select("*")
        .eq("published", true)
        .order("sort_order")
        .order("name")
        .limit(40),
    ),
    rowsOf(() =>
      client
        .from("events")
        .select(
          "id,name,slug,venue_name,location,starts_at,ends_at,ticket_price,currency,image_url,photos,description,status",
        )
        .eq("status", "active")
        .order("starts_at", { ascending: false })
        .limit(12),
    ),
    rowsOf(() =>
      client
        .from("sport_news")
        .select(
          "id,title,slug,summary,body,category,source,image_url,cover_url,is_featured,published_at,status",
        )
        .eq("status", "active")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(12),
    ),
    rowsOf(() =>
      client
        .from("radio_streams")
        .select(
          "id,name,tagline,genre,city,image_url,website_url,status,is_featured,sort_order",
        )
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("sort_order")
        .limit(8),
    ),
    rowsOf(() =>
      client
        .from("live_events")
        .select(
          "id,kind,name,starts_at,status,description,home_name,away_name,home_score,away_score,thumbnail_url",
        )
        .in("status", ["scheduled", "live", "finished"])
        .order("starts_at", { ascending: false })
        .limit(6),
    ),
    rowsOf(() =>
      client
        .from("opportunities")
        .select(
          "id,title,description,category,organizer,location,country,cover_image_url,status,is_published,fee_type,fee_amount,application_deadline,start_date,external_link,eligibility_requirements,required_documents,additional_terms,eligible_roles",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12),
    ),
    rowsOf(() =>
      client
        .from("donation_campaigns")
        .select("id,title,summary,image_url,cover_url,goal_amount,currency,status")
        .eq("status", "active")
        .limit(4),
    ),
    rowsOf(() =>
      client.from("app_settings").select("id,data").in("id", ["settings", "policy", "contact_us"]),
    ),
    rowsOf(() =>
      client.from("marketing_settings").select("key,value").eq("is_public", true).limit(80),
    ),
  ]);

  const degraded = [mini, events, news, settings].some((result) => result.failed);

  return {
    site: buildSite(
      settings.rows as Array<{ id: string; data: unknown }>,
      marketing.rows as Array<{ key: string; value: string | null }>,
      degraded,
    ),
    miniApps: mini.rows
      .map(mapMiniApp)
      .filter((item): item is MiniApp => Boolean(item))
      .filter((item) => item.slug !== "zemen-service" && item.name.toLowerCase() !== "zemen service"),
    events: events.rows.map(mapEvent).filter((item): item is SportEvent => Boolean(item)),
    news: news.rows.map(mapNews).filter((item): item is NewsArticle => Boolean(item)),
    radio: radio.rows.map(mapRadio).filter((item): item is RadioStation => Boolean(item)),
    live: live.rows.map(mapLive).filter((item): item is LiveMatch => Boolean(item)),
    opportunities: opportunities.rows
      .map(mapOpportunity)
      .filter((item): item is Opportunity => Boolean(item)),
    donations: donations.rows
      .map(mapDonation)
      .filter((item): item is Donation => Boolean(item)),
  };
}

export const getCatalog = cache(loadCatalog);

export function findBySlug<T extends { slug: string; id: string }>(items: T[], key: string) {
  const value = key.trim();
  return items.find((item) => item.slug === value || item.id === value) ?? null;
}

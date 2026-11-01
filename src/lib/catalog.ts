import { cache } from "react";
import { getApiBaseUrl } from "@/lib/env";
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

const LIVE_STATUSES = new Set(["scheduled", "live", "finished"]);

/** Public Play listing. The API has no store-url field yet. */
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.spojex.superapp";

type AppInfo = {
  app?: { name?: string; latest_version?: string };
  support?: {
    email?: string;
    phone?: string;
    url?: string;
    address?: string;
    email_subject?: string;
  };
  legal?: {
    terms?: string;
    privacy?: string;
    community_guidelines?: string;
    about?: string;
  };
};

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

function keywordsFrom(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 16);
}

function buildSite(info: AppInfo, degraded: boolean): PublicSite {
  const app = info.app ?? {};
  const support = info.support ?? {};
  const legal = info.legal ?? {};
  const appName = text(app.name) || "Spojex";
  const about = policyToPlain(text(legal.about));
  const privacy = text(legal.privacy) || FALLBACK_PRIVACY;
  const terms = text(legal.terms) || FALLBACK_TERMS;
  const headline = FALLBACK_HERO.headline;
  const description = clip(about, 220) || FALLBACK_HERO.description;

  return {
    appName,
    appColor: "#0A2463",
    version: text(app.latest_version),
    eyebrow: FALLBACK_HERO.eyebrow,
    headline,
    description,
    about,
    companyDescription:
      clip(about, 180) ||
      "Spojex brings sports services, opportunities, events, and community content into one super app for Ethiopia.",
    seoTitle: `${appName} — ${headline}`,
    seoDescription: clip(description, 180),
    keywords: keywordsFrom(
      "Spojex, sports super app, Ethiopian football, events, opportunities",
    ),
    email: text(support.email) || null,
    phone: text(support.phone) || null,
    address: text(support.address) || null,
    emailSubject: text(support.email_subject) || `${appName} support`,
    supportUrl: safeHttpsUrl(support.url),
    appStoreUrl: null,
    playStoreUrl: PLAY_STORE_URL,
    logoUrl: null,
    socials: [],
    privacyPolicy: privacy,
    terms,
    cookiePolicy: FALLBACK_COOKIE,
    communityGuidelines: text(legal.community_guidelines) || FALLBACK_COMMUNITY,
    refundPolicy: FALLBACK_REFUND,
    degraded,
  };
}

async function apiGet(path: string): Promise<{ data: unknown; failed: boolean }> {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return { data: null, failed: true };
    return { data: await response.json(), failed: false };
  } catch {
    return { data: null, failed: true };
  }
}

function asRows(data: unknown) {
  return (Array.isArray(data) ? data : []) as Row[];
}

function asAppInfo(data: unknown): AppInfo {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  return data as AppInfo;
}

async function loadCatalog(): Promise<Catalog> {
  const [mini, events, news, radio, live, opportunities, donations, info] =
    await Promise.all([
      apiGet("/api/v1/marketplace/mini_apps?published=true&limit=40&order=sort_order.asc"),
      apiGet("/api/v1/events/events?status=active&limit=12&order=starts_at.desc"),
      apiGet("/api/v1/marketplace/sport_news?status=active&limit=12&order=published_at.desc"),
      apiGet("/api/v1/streaming/radio_streams?status=active&limit=8&order=sort_order.asc"),
      apiGet("/api/v1/streaming/live_events?limit=12&order=starts_at.desc"),
      apiGet("/api/v1/marketplace/opportunities?is_published=true&limit=12&order=created_at.desc"),
      apiGet("/api/v1/donations/donation_campaigns?status=active&limit=4"),
      apiGet("/api/v1/platform/app-info"),
    ]);

  const degraded = [mini, events, news, info].some((result) => result.failed);

  return {
    site: buildSite(asAppInfo(info.data), degraded),
    miniApps: asRows(mini.data)
      .map(mapMiniApp)
      .filter((item): item is MiniApp => Boolean(item))
      .filter((item) => item.slug !== "zemen-service" && item.name.toLowerCase() !== "zemen service"),
    events: asRows(events.data)
      .map(mapEvent)
      .filter((item): item is SportEvent => Boolean(item)),
    news: asRows(news.data)
      .map(mapNews)
      .filter((item): item is NewsArticle => Boolean(item)),
    radio: asRows(radio.data)
      .map(mapRadio)
      .filter((item): item is RadioStation => Boolean(item)),
    live: asRows(live.data)
      .map(mapLive)
      .filter((item): item is LiveMatch => Boolean(item))
      .filter((item) => LIVE_STATUSES.has(item.status)),
    opportunities: asRows(opportunities.data)
      .map(mapOpportunity)
      .filter((item): item is Opportunity => Boolean(item)),
    donations: asRows(donations.data)
      .map(mapDonation)
      .filter((item): item is Donation => Boolean(item)),
  };
}

export const getCatalog = cache(loadCatalog);

export function findBySlug<T extends { slug: string; id: string }>(items: T[], key: string) {
  const value = key.trim();
  return items.find((item) => item.slug === value || item.id === value) ?? null;
}

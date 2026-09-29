-- Public marketing configuration for the Spojex marketing website.
-- Reuses the shared Spojex Postgres database. Does not replace app_settings.
-- app_settings remains the source for app name, contact, privacy, and terms.
-- This table holds marketing-only values that app_settings does not model,
-- and only rows with is_public = true are readable by the website.

create table if not exists public.marketing_settings (
  key text primary key,
  value text not null default '',
  type text not null default 'text'
    check (type in ('text', 'url', 'html', 'boolean', 'json')),
  category text not null default 'general',
  description text not null default '',
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists marketing_settings_public_category_idx
  on public.marketing_settings (category, key)
  where is_public = true;

drop trigger if exists marketing_settings_updated_at on public.marketing_settings;
create trigger marketing_settings_updated_at
  before update on public.marketing_settings
  for each row execute function public.set_updated_at();

alter table public.marketing_settings enable row level security;

drop policy if exists marketing_settings_public_select on public.marketing_settings;
create policy marketing_settings_public_select
  on public.marketing_settings
  for select
  to anon, authenticated
  using (is_public = true);

grant select on public.marketing_settings to anon, authenticated;

insert into public.marketing_settings (key, value, type, category, description, is_public)
values
  (
    'hero_headline',
    'One Super App. Everything Sports.',
    'text',
    'homepage',
    'Primary homepage headline.',
    true
  ),
  (
    'hero_description',
    'Connect with opportunities, discover events, follow sports content, connect with the community, and access the growing Spojex sports ecosystem from one app.',
    'text',
    'homepage',
    'Supporting homepage description.',
    true
  ),
  (
    'seo_title',
    'Spojex — One Super App. Everything Sports.',
    'text',
    'seo',
    'Default document title.',
    true
  ),
  (
    'seo_description',
    'Spojex is the sports super app for athletes, fans, coaches, scouts, agents, academies, events, and sports content across Ethiopia.',
    'text',
    'seo',
    'Default meta description.',
    true
  ),
  (
    'seo_keywords',
    'Spojex, sports super app, Ethiopian football, trials, academies, scouts, events, sports news',
    'text',
    'seo',
    'Comma-separated SEO keywords.',
    true
  ),
  (
    'company_description',
    'Spojex brings sports services, opportunities, events, and community content into one super app for Ethiopia.',
    'text',
    'brand',
    'Short description used in the footer and about page.',
    true
  ),
  ('app_store_url', '', 'url', 'download', 'Apple App Store URL for the Spojex super app.', true),
  ('play_store_url', '', 'url', 'download', 'Google Play Store URL for the Spojex super app.', true),
  ('social_instagram', '', 'url', 'social', 'Instagram profile URL.', true),
  ('social_facebook', '', 'url', 'social', 'Facebook page URL.', true),
  ('social_x', '', 'url', 'social', 'X / Twitter profile URL.', true),
  ('social_tiktok', '', 'url', 'social', 'TikTok profile URL.', true),
  ('social_youtube', '', 'url', 'social', 'YouTube channel URL.', true),
  ('social_telegram', '', 'url', 'social', 'Telegram channel URL.', true),
  ('social_linkedin', '', 'url', 'social', 'LinkedIn page URL.', true),
  (
    'cookie_policy',
    'This website stores only what it needs to load pages reliably. Spojex does not sell personal information. The Spojex app may use device identifiers to deliver push notifications, as described in the Privacy Policy. Third-party pages opened from Spojex, including payment providers, use their own cookies and policies.',
    'text',
    'legal',
    'Public cookie policy.',
    true
  ),
  (
    'community_guidelines',
    'Spojex is for athletes, fans, coaches, scouts, agents, academies, and clubs. Use the app lawfully and respectfully. Do not harass others, upload illegal content, or misuse bookings, tickets, donations, chat, or profiles. We may suspend accounts that violate these guidelines or the Terms of Service.',
    'text',
    'legal',
    'Public community guidelines.',
    true
  ),
  (
    'refund_policy',
    'Payments for tickets, donations, gym memberships, and services are processed by third-party providers. Refunds follow the event, campaign, or service terms shown before you pay. If a payment does not complete, contact Spojex support with the details published on this website.',
    'text',
    'legal',
    'Public refund and cancellation policy.',
    true
  )
on conflict (key) do nothing;

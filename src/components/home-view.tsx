import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { JsonLd } from "@/components/json-ld";
import { MediaImage } from "@/components/media-image";
import { MiniStoreButtons, StoreButtons } from "@/components/store-buttons";
import type { Catalog } from "@/lib/catalog";
import { formatDay, formatMoney, formatWhen, opportunityStatusLabel } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { ECOSYSTEM_ROLES, HOST_MODULES } from "@/lib/roles";

function SectionTitle({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold tracking-[0.2em] text-pitch uppercase">{kicker}</p>
      <h2 className="font-display mt-2 text-4xl leading-none font-semibold text-pitch-deep sm:text-6xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-muted">{body}</p>
    </div>
  );
}

export function HomeView({ catalog }: { catalog: Catalog }) {
  const { site, miniApps, events, news, radio, live, opportunities, donations } = catalog;
  const upcoming = events.filter((event) => event.timing === "upcoming" || event.timing === "today");
  const shownEvents = (upcoming.length ? upcoming : events).slice(0, 3);
  const heroImage = events[0]?.imageUrl || news[0]?.imageUrl || null;
  const sportsRadio = radio.filter((station) => /sport/i.test(station.genre) || station.featured);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: site.appName,
    applicationCategory: "SportsApplication",
    operatingSystem: "iOS, Android",
    description: site.seoDescription,
    url: absoluteUrl("/"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "ETB" },
    ...(site.appStoreUrl ? { installUrl: site.appStoreUrl } : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="hero-wash relative overflow-hidden text-white">
        <div className="pitch-grid absolute inset-0" />
        <div className="float-slow absolute -top-10 right-[8%] h-40 w-40 rounded-full border-[14px] border-white/10" />
        <div className="float-delay absolute bottom-10 left-[6%] h-16 w-16 rounded-full bg-gold/80" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="reveal">
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">{site.eyebrow}</p>
            <h1 className="font-display mt-3 text-6xl leading-[0.86] font-semibold tracking-tight sm:text-8xl">
              {site.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">{site.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#download"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-6 font-semibold text-pitch-ink"
              >
                Download Spojex
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 font-semibold text-white"
              >
                Explore Opportunities
              </Link>
            </div>
            <StoreButtons site={site} className="mt-6" />
          </div>
          <div className="reveal reveal-late relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl sm:aspect-[5/4]">
              <MediaImage src={heroImage} alt="" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-pitch-ink via-pitch-ink/20 to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <p className="text-xs tracking-[0.16em] text-gold uppercase">Inside one app</p>
                <p className="font-display mt-1 text-3xl leading-none font-semibold">
                  Services, trials, match days, and the stands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-[2rem] bg-pitch-deep px-6 py-8 text-white md:grid-cols-[0.8fr_1.2fr] md:px-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">The super app</p>
            <h2 className="font-display mt-2 text-4xl leading-none font-semibold sm:text-5xl">
              Many sports services. One Spojex.
            </h2>
          </div>
          <p className="text-base leading-7 text-white/75">
            Spojex is the home for the Ethiopian sports community: players, fans, coaches, scouts,
            agents, academies, clubs, events, and the media around the game. Mini apps sit beside
            native tools for tickets, news, radio, donations, gyms, and stadiums.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOST_MODULES.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="card-lift rounded-3xl border border-line bg-white p-5"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-leaf uppercase">{module.category}</p>
              <p className="font-display mt-2 text-3xl leading-none font-semibold text-pitch-deep">
                {module.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{module.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="mini-apps" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <SectionTitle
          kicker="Mini apps"
          title="Everything you need. One super app."
          body="Published mini apps from the Spojex catalog. Each one opens inside the super app."
        />
        {miniApps.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {miniApps.map((app) => (
              <article key={app.id} className="card-lift flex flex-col rounded-[1.75rem] border border-line bg-white p-5 sm:flex-row sm:gap-5">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-pitch-deep sm:h-auto sm:w-36">
                  <MediaImage src={app.logoUrl} alt="" />
                  {!app.logoUrl ? (
                    <span className="font-display absolute inset-0 grid place-items-center text-5xl font-semibold text-white">
                      {app.name.slice(0, 1)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-1 flex-col sm:mt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-3xl leading-none font-semibold text-pitch-deep">{app.name}</h3>
                    <span className="rounded-full bg-pitch/10 px-2 py-1 text-xs font-semibold text-pitch">
                      {app.category}
                    </span>
                  </div>
                  {app.partner ? <p className="mt-2 text-sm text-muted">{app.partner}</p> : null}
                  <p className="mt-2 text-sm leading-6 text-ink/80">{app.summary}</p>
                  {app.features.length ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {app.features.map((feature) => (
                        <li key={feature} className="rounded-full bg-canvas px-2 py-1 text-xs">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href={`/mini-apps/${app.slug}`} className="text-sm font-semibold text-pitch">
                      View {app.name}
                    </Link>
                    <MiniStoreButtons appStoreUrl={app.appStoreUrl} playStoreUrl={app.playStoreUrl} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No published mini apps yet"
              body="When a mini app is published in Spojex, it will show up here."
            />
          </div>
        )}
      </section>

      <section id="opportunities" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          kicker="Opportunities"
          title="Pathways for the people around the game."
          body="Published opportunities from Spojex, for the roles the super app already supports."
        />
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {ECOSYSTEM_ROLES.map((role) => (
            <article key={role.id} className="min-w-[220px] rounded-3xl bg-pitch-ink p-4 text-white">
              <p className="font-display text-3xl leading-none font-semibold">{role.label}</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{role.blurb}</p>
            </article>
          ))}
        </div>
        {opportunities.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {opportunities.map((item) => (
              <Link
                key={item.id}
                href={`/opportunities/${item.id}`}
                className="card-lift grid overflow-hidden rounded-[1.75rem] bg-white shadow-sm sm:grid-cols-[180px_1fr]"
              >
                <div className="relative min-h-40">
                  <MediaImage src={item.coverUrl} alt="" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-leaf uppercase">
                    {opportunityStatusLabel(item.status)} · {item.category}
                  </p>
                  <h3 className="font-display mt-2 text-3xl leading-none font-semibold text-pitch-deep">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {[item.organizer, item.location, item.country].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No public opportunities right now"
              body="Open trials, roles, and pathways will appear when they are published in Spojex."
            />
          </div>
        )}
      </section>

      <section id="events" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            kicker="Events"
            title={upcoming.length ? "Upcoming on Spojex" : "Events on Spojex"}
            body={
              upcoming.length
                ? "Public listings with dates, venues, and ticket prices."
                : "No upcoming public events right now. Recent listings from the Spojex catalog are below."
            }
          />
          {shownEvents.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {shownEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`} className="card-lift overflow-hidden rounded-[1.75rem] border border-line">
                  <div className="relative h-44">
                    <MediaImage src={event.imageUrl} alt="" />
                    <span className="absolute top-3 left-3 rounded-full bg-pitch-ink/80 px-3 py-1 text-xs font-semibold text-white">
                      {formatDay(event.startsAt)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-3xl leading-none font-semibold text-pitch-deep">{event.name}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {formatWhen(event.startsAt)}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6">{event.description}</p>
                    <p className="mt-3 text-sm font-semibold text-pitch">
                      {formatMoney(event.ticketPrice, event.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState title="No public events yet" body="Active events from Spojex will be listed here." />
            </div>
          )}
        </div>
      </section>

      <section id="community" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          kicker="Community"
          title="More than a fixture list."
          body="News, radio, donations, and match coverage already live in the Spojex ecosystem."
        />
        {news.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {news.slice(0, 4).map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="card-lift grid overflow-hidden rounded-[1.75rem] bg-white sm:grid-cols-[160px_1fr]">
                <div className="relative min-h-36">
                  <MediaImage src={article.imageUrl} alt="" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold tracking-[0.16em] text-pitch uppercase">{article.category}</p>
                  <h3 className="mt-2 text-xl leading-snug font-semibold">{article.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{article.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title="No published stories yet" body="Sports news will show here when it is active in Spojex." />
          </div>
        )}

        {sportsRadio.length || radio.length ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(sportsRadio.length ? sportsRadio : radio).slice(0, 4).map((station) => (
              <article key={station.id} className="rounded-3xl border border-line bg-white p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-leaf uppercase">{station.genre || "Radio"}</p>
                <h3 className="font-display mt-2 text-2xl leading-none font-semibold text-pitch-deep">{station.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{station.tagline}</p>
                {station.websiteUrl ? (
                  <a href={station.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-pitch">
                    Station site
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {live.length ? (
          <div className="mt-8 rounded-[1.75rem] bg-pitch-ink p-5 text-white">
            <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Recent coverage</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {live.slice(0, 3).map((match) => (
                <article key={match.id} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase text-white/50">{match.status}</p>
                  <p className="mt-1 font-semibold">{match.name}</p>
                  {match.homeName && match.awayName ? (
                    <p className="font-display mt-2 text-3xl leading-none">
                      {match.homeScore} <span className="text-white/40">–</span> {match.awayScore}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {donations.length ? (
          <div id="impact" className="mt-8 grid gap-4 md:grid-cols-2">
            {donations.map((campaign) => (
              <article key={campaign.id} className="overflow-hidden rounded-[1.75rem] bg-white">
                <div className="relative h-40">
                  <MediaImage src={campaign.imageUrl} alt="" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-leaf uppercase">Impact</p>
                  <h3 className="mt-2 text-xl font-semibold">{campaign.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{campaign.summary}</p>
                  {campaign.goalAmount ? (
                    <p className="mt-3 text-sm font-semibold text-pitch">
                      Goal {formatMoney(campaign.goalAmount, campaign.currency)}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section id="download" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="hero-wash relative overflow-hidden rounded-[2rem] px-6 py-10 text-white sm:px-10">
          <div className="pitch-grid absolute inset-0 opacity-70" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Download</p>
            <h2 className="font-display mt-2 text-5xl leading-none font-semibold sm:text-6xl">
              Get the whole ecosystem in one app.
            </h2>
            <p className="mt-4 text-white/75">
              Spojex is the super app. Store buttons appear when an App Store or Google Play link is
              published in Spojex settings.
            </p>
            <StoreButtons site={site} className="mt-6" />
            {!site.appStoreUrl && !site.playStoreUrl ? (
              <p className="mt-4 text-sm text-white/60">
                Official store listings are not published yet.
                {site.email ? ` Write to ${site.email} for access.` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

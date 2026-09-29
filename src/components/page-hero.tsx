export function PageHero({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <section className="hero-wash relative overflow-hidden text-white">
      <div className="pitch-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">{kicker}</p>
        <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[0.9] font-semibold tracking-tight sm:text-7xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{body}</p>
      </div>
    </section>
  );
}

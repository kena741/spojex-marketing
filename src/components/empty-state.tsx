export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-pitch/25 bg-white px-6 py-10 text-center">
      <p className="font-display text-3xl font-semibold text-pitch-deep">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

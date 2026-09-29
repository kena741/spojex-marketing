"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-display text-5xl font-semibold text-pitch-deep">Something shifted.</p>
      <p className="mt-3 text-muted">
        The public Spojex catalog could not be loaded. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-pitch px-5 py-3 text-sm font-semibold text-white"
      >
        Retry
      </button>
    </div>
  );
}

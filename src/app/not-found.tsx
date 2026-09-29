import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Off the pitch</p>
      <h1 className="font-display mt-3 text-6xl font-semibold text-pitch-deep">Page not found</h1>
      <p className="mt-3 text-muted">That link is not part of the public Spojex site.</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-pitch px-5 py-3 text-sm font-semibold text-white">
        Back home
      </Link>
    </div>
  );
}

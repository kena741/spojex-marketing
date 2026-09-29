function read(name: string) {
  return (process.env[name] || "").trim();
}

/** Server-only Supabase URL. Accepts the Admin env name as a fallback. */
export function getSupabaseUrl() {
  return (
    read("SUPABASE_URL") || read("NEXT_PUBLIC_SUPABASE_URL")
  ).replace(/\/$/, "");
}

/** Anon / publishable key. Never the service-role key. */
export function getSupabasePublishableKey() {
  return (
    read("SUPABASE_PUBLISHABLE_KEY") ||
    read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    read("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    read("SUPABASE_ANON_KEY")
  );
}

export function getSiteUrl() {
  const raw = read("SITE_URL") || read("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

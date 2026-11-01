function read(name: string) {
  return (process.env[name] || "").trim();
}

/** Spojex API on Cloud Run. Same default the super app and admin use. */
export const DEFAULT_API_BASE_URL =
  "https://spojex-backend-prod-576757759417.europe-west3.run.app";

export function getApiBaseUrl() {
  return (
    read("SPOJEX_API_BASE_URL") ||
    read("NEXT_PUBLIC_SPOJEX_API_BASE_URL") ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
}

export function getSiteUrl() {
  const raw = read("SITE_URL") || read("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

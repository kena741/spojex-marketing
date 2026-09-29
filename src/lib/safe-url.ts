const BLOCKED_PROTOCOL = /^(javascript|data|file|vbscript):/i;

export function safeHttpsUrl(value: unknown): string | null {
  const raw = `${value ?? ""}`.trim();
  if (!raw || BLOCKED_PROTOCOL.test(raw)) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** https links, or an app deep link such as spojex:// */
export function safeAppLink(value: unknown): string | null {
  const https = safeHttpsUrl(value);
  if (https) return https;
  const raw = `${value ?? ""}`.trim();
  if (!raw || BLOCKED_PROTOCOL.test(raw) || raw.length > 500) return null;
  try {
    const url = new URL(raw);
    if (!/^[a-z][a-z0-9+.-]*:$/i.test(url.protocol)) return null;
    if (url.protocol === "http:" || url.protocol === "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isAppStoreUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "apps.apple.com" || host.endsWith(".apps.apple.com");
  } catch {
    return false;
  }
}

export function isPlayStoreUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "play.google.com" || host.endsWith(".play.google.com");
  } catch {
    return false;
  }
}

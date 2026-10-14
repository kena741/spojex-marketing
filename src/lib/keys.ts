export function isPublicKey(value: string) {
  return /^[A-Za-z0-9-]{1,120}$/.test(value);
}

/** App share / deep-link content ids (`uuid` or `gymv:uuid`). */
export function isAppContentId(value: string) {
  const v = value.trim();
  if (!v || v.length > 80) return false;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) {
    return true;
  }
  return /^gymv:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

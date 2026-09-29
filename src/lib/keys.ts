export function isPublicKey(value: string) {
  return /^[A-Za-z0-9-]{1,120}$/.test(value);
}

import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 300;

const BLOCKED_KEY = /secret|password|service_role|private_key|token|api[_-]?key|notification_server|googlemap|chapa/i;

function scrub(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrub);
  if (!value || typeof value !== "object") return value;
  const next: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (BLOCKED_KEY.test(key)) continue;
    next[key] = scrub(item);
  }
  return next;
}

export async function GET() {
  const catalog = await getCatalog();
  return NextResponse.json(scrub(catalog), {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

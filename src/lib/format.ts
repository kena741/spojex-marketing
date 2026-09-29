const ADDIS = "Africa/Addis_Ababa";

export function formatWhen(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: ADDIS,
  }).format(date);
}

export function formatDay(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: ADDIS,
  }).format(date);
}

export function eventTiming(startsAt: string) {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return "scheduled" as const;
  const today = new Date();
  const startDay = start.toLocaleDateString("en-CA", { timeZone: ADDIS });
  const todayDay = today.toLocaleDateString("en-CA", { timeZone: ADDIS });
  if (startDay === todayDay) return "today" as const;
  return start.getTime() > today.getTime() ? ("upcoming" as const) : ("past" as const);
}

export function formatMoney(amount: number, currency: string) {
  if (!amount) return "Free";
  const code = currency || "ETB";
  try {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: code,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString("en-ET")}`;
  }
}

export function clip(value: string, max = 160) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export function opportunityStatusLabel(status: string) {
  switch (status) {
    case "open":
      return "Open";
    case "coming_soon":
      return "Coming soon";
    case "closed":
      return "Closed";
    default:
      return status.replaceAll("_", " ");
  }
}

/** Labels from Spojex Admin opportunity roles and the super app identity catalog. */
export const ROLE_LABELS: Record<string, string> = {
  player: "Player",
  scout: "Scout",
  agent: "Agent",
  coach: "Coach",
  fan: "Fan",
  referee: "Referee",
  parent_guardian: "Parent / Guardian",
  analyst: "Analyst",
  fitness_coach: "Fitness coach",
  physiotherapist: "Physiotherapist",
  nutritionist: "Nutritionist",
  administrator: "Administrator",
  trainer: "Trainer",
  consultant: "Consultant",
  medical: "Medical",
  other_professional: "Other professional",
  photographer: "Photographer / Videographer",
  sports_journalist: "Journalist / Media",
};

export function roleLabel(id: string) {
  return ROLE_LABELS[id] ?? id.replaceAll("_", " ");
}

/** Blurbs copied from the super app identity catalog. */
export const ECOSYSTEM_ROLES = [
  {
    id: "player",
    label: "Player",
    blurb: "Build identity, get discovered, apply to trials.",
  },
  {
    id: "coach",
    label: "Coach",
    blurb: "Reputation, roles, and staff opportunities.",
  },
  {
    id: "scout",
    label: "Scout",
    blurb: "Find talent and follow verified pipelines.",
  },
  {
    id: "agent",
    label: "Agent",
    blurb: "Represent players and manage professional pathways.",
  },
  {
    id: "fan",
    label: "Fan",
    blurb: "Follow clubs, events, and communities.",
  },
  {
    id: "academy",
    label: "Academy",
    blurb: "Youth development and player pathways.",
  },
  {
    id: "club",
    label: "Club",
    blurb: "Recruit, publish, and operate as a football club.",
  },
] as const;

/**
 * Native modules shipped on the super app Apps screen.
 * Stream is omitted because that shortcut is disabled in the host app.
 */
export const HOST_MODULES = [
  {
    name: "Services",
    category: "Services",
    summary: "Book local services from coaches, scouts, and partners.",
    href: "/#download",
  },
  {
    name: "Stadiums",
    category: "Training",
    summary: "Browse venues and book pitch time.",
    href: "/#download",
  },
  {
    name: "Gyms",
    category: "Training",
    summary: "Memberships, programs, and training communities.",
    href: "/#download",
  },
  {
    name: "Donations",
    category: "Impact",
    summary: "Support clubs, academies, and community football.",
    href: "/#impact",
  },
  {
    name: "Events",
    category: "Tickets",
    summary: "Match days, cups, and ticketed gatherings.",
    href: "/events",
  },
  {
    name: "News",
    category: "Media",
    summary: "Football stories from the Spojex desk and clubs.",
    href: "/news",
  },
  {
    name: "Radio",
    category: "Media",
    summary: "Live stations, including sports radio.",
    href: "/#community",
  },
] as const;

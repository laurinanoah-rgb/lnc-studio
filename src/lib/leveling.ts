const XP_PER_LEVEL = 100;

export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpIntoLevel(xp);
}

export type BadgeStats = {
  checkedInEvents: number;
  pollVotes: number;
  groupPosts: number;
  xp: number;
  specialBadges?: string[];
};

export type Badge = { icon: string; label: string };

const SPECIAL_BADGE_LABELS: Record<string, Badge> = {
  easter_egg: { icon: "🥚", label: "Geheimes Ei gefunden" },
};

export function computeBadges(stats: BadgeStats): Badge[] {
  const badges: Badge[] = [];

  if (stats.checkedInEvents >= 1) badges.push({ icon: "🎉", label: "Event-Teilnehmer:in" });
  if (stats.checkedInEvents >= 5) badges.push({ icon: "🔥", label: "5× dabei gewesen" });
  if (stats.pollVotes >= 3) badges.push({ icon: "🗳️", label: "Abstimmer:in" });
  if (stats.groupPosts >= 5) badges.push({ icon: "💬", label: "Wortführer:in" });
  if (getLevel(stats.xp) >= 5) badges.push({ icon: "⭐", label: "Level 5 erreicht" });

  for (const key of stats.specialBadges ?? []) {
    const badge = SPECIAL_BADGE_LABELS[key];
    if (badge) badges.push(badge);
  }

  return badges;
}

export function getUnlocksForLevel(level: number): string[] {
  const unlocks: string[] = [];

  if (level === 5) unlocks.push("🎨 Dein Name leuchtet jetzt in einer eigenen Farbe!");
  if (level === 10) {
    unlocks.push("✨ Dein Name bekommt jetzt einen Glow-Effekt");
    unlocks.push("🎨 „LNC Neon Mode“ ist jetzt in deinen Profil-Einstellungen verfügbar!");
  }
  if (level === 15) unlocks.push("🌈 Dein Name ist jetzt animiert eingefärbt – Regenbogen-Style!");

  return unlocks;
}

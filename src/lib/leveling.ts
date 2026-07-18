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
};

export type Badge = { icon: string; label: string };

export function computeBadges(stats: BadgeStats): Badge[] {
  const badges: Badge[] = [];

  if (stats.checkedInEvents >= 1) badges.push({ icon: "🎉", label: "Erstes Event dabei" });
  if (stats.checkedInEvents >= 5) badges.push({ icon: "🔥", label: "5× dabei gewesen" });
  if (stats.pollVotes >= 3) badges.push({ icon: "🗳️", label: "Abstimmer:in" });
  if (stats.groupPosts >= 5) badges.push({ icon: "💬", label: "Wortführer:in" });
  if (getLevel(stats.xp) >= 5) badges.push({ icon: "⭐", label: "Level 5 erreicht" });

  return badges;
}

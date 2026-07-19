import { prisma } from "@/lib/prisma";
import { getLevel, getUnlocksForLevel } from "@/lib/leveling";

export async function awardXp(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const oldLevel = getLevel(user.xp);
  const newXp = user.xp + amount;
  const newLevel = getLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      ...(leveledUp ? { pendingLevelUp: { level: newLevel, unlocks: getUnlocksForLevel(newLevel) } } : {}),
      ...(newLevel >= 10 && oldLevel < 10 ? { level10UnlockedAt: new Date() } : {}),
    },
  });
}

import { prisma } from "@/lib/prisma";

export async function canViewEvent(
  event: { groupId: string | null },
  userId: string | undefined,
): Promise<boolean> {
  if (!event.groupId) return true;

  const group = await prisma.group.findUnique({ where: { id: event.groupId } });
  if (!group) return false;
  if (group.public) return true;
  if (!userId) return false;
  if (group.ownerId === userId) return true;

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId, groupId: event.groupId } },
  });
  return !!membership;
}

export async function canManageEvent(
  event: { groupId: string | null },
  userId: string | undefined,
  role: string | undefined,
): Promise<boolean> {
  if (!userId) return false;
  if (role === "MANAGER" || role === "TEAM") return true;
  if (!event.groupId) return false;

  const group = await prisma.group.findUnique({ where: { id: event.groupId } });
  return group?.ownerId === userId;
}

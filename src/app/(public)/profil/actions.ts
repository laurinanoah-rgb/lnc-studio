"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { awardXp } from "@/lib/xp";
import { getLevel } from "@/lib/leveling";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!name) {
    throw new Error("Name ist erforderlich.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, avatarUrl: avatarUrl || null, bio: bio || null },
  });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser && !dbUser.profileBonusClaimed && dbUser.avatarUrl && dbUser.bio) {
    await prisma.user.update({ where: { id: user.id }, data: { profileBonusClaimed: true } });
    await awardXp(user.id, 50);
  }

  revalidatePath("/profil");
  revalidatePath("/profil/personalisierung");
  revalidatePath("/mitglieder");
}

const SOCIAL_FIELDS = ["discordHandle", "instagramUrl", "tiktokUrl", "youtubeUrl"] as const;
export type SocialField = (typeof SOCIAL_FIELDS)[number];

export async function updateSocialLink(field: SocialField, formData: FormData) {
  const user = await requireUser();
  if (!SOCIAL_FIELDS.includes(field)) throw new Error("Unbekanntes Feld.");

  const value = String(formData.get("value") ?? "").trim();
  if (!value) throw new Error("Bitte einen Wert eingeben.");

  await prisma.user.update({ where: { id: user.id }, data: { [field]: value } });

  revalidatePath("/profil/personalisierung");
  revalidatePath("/mitglieder");
}

export async function disconnectSocialLink(field: SocialField) {
  const user = await requireUser();
  if (!SOCIAL_FIELDS.includes(field)) throw new Error("Unbekanntes Feld.");

  await prisma.user.update({ where: { id: user.id }, data: { [field]: null } });

  revalidatePath("/profil/personalisierung");
  revalidatePath("/mitglieder");
}

export async function changeEmail(formData: FormData) {
  const user = await requireUser();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error("E-Mail ist erforderlich.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== user.id) {
    throw new Error("Es existiert bereits ein Konto mit dieser E-Mail-Adresse.");
  }

  await prisma.user.update({ where: { id: user.id }, data: { email } });
  revalidatePath("/profil");
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(a: Date, b: Date) {
  const yesterday = new Date(b);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(a, yesterday);
}

export async function claimDailyBonus() {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) throw new Error("Konto nicht gefunden.");

  const now = new Date();
  if (dbUser.lastClaimAt && isSameDay(dbUser.lastClaimAt, now)) {
    return;
  }

  const continuesStreak = dbUser.lastClaimAt ? isYesterday(dbUser.lastClaimAt, now) : false;
  const newStreak = continuesStreak ? dbUser.loginStreak + 1 : 1;
  const reward = newStreak === 1 ? 10 : newStreak === 2 ? 20 : 50;

  await prisma.user.update({
    where: { id: user.id },
    data: { lastClaimAt: now, loginStreak: newStreak },
  });
  await awardXp(user.id, reward);

  revalidatePath("/profil");
}

export async function toggleNeonMode(enabled: boolean) {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || getLevel(dbUser.xp) < 10) {
    throw new Error("LNC Neon Mode ist erst ab Level 10 verfügbar.");
  }

  await prisma.user.update({ where: { id: user.id }, data: { neonModeEnabled: enabled } });
  revalidatePath("/", "layout");
}

export async function claimEasterEgg() {
  const session = await auth();
  if (!session?.user) return;

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!dbUser || dbUser.specialBadges.includes("easter_egg")) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { specialBadges: { push: "easter_egg" } },
  });
  await awardXp(session.user.id, 100);

  revalidatePath("/profil");
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (newPassword.length < 8) {
    throw new Error("Das neue Passwort muss mindestens 8 Zeichen haben.");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) throw new Error("Konto nicht gefunden.");

  const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!valid) {
    throw new Error("Aktuelles Passwort ist falsch.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  revalidatePath("/profil");
}

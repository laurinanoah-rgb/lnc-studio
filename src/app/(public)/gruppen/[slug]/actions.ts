"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { GroupTag } from "@prisma/client";
import { slugify } from "@/lib/slugify";
import { sanitizeRichText } from "@/lib/sanitize";

async function requireOwner(groupId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== session.user.id) {
    throw new Error("Nur die Gruppen-Inhaberin oder der Gruppen-Inhaber darf das.");
  }
  return { user: session.user, group };
}

async function requireOwnerOrModerator(groupId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) throw new Error("Gruppe nicht gefunden.");
  if (group.ownerId === session.user.id) return { user: session.user, group };

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });
  if (membership?.role !== "MODERATOR") {
    throw new Error("Nur Inhaber:in oder Moderator:in dürfen das.");
  }
  return { user: session.user, group };
}

async function requireMember(groupId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });
  if (!membership) {
    throw new Error("Nur Gruppen-Mitglieder dürfen das.");
  }
  return session.user;
}

export async function updateGroupSettings(groupId: string, slug: string, formData: FormData) {
  await requireOwner(groupId);
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tag = String(formData.get("tag") ?? "SONSTIGES") as GroupTag;
  const locked = formData.get("locked") === "on";
  const coverImage = String(formData.get("coverImage") ?? "").trim();

  if (!name || !description) {
    throw new Error("Name und Beschreibung sind erforderlich.");
  }

  await prisma.group.update({
    where: { id: groupId },
    data: { name, description, tag, locked, coverImage: coverImage || null },
  });

  revalidatePath(`/gruppen/${slug}`);
  revalidatePath(`/gruppen/${slug}/einstellungen`);
  revalidatePath("/gruppen");
}

export async function setMemberRole(
  groupId: string,
  userId: string,
  slug: string,
  role: "MEMBER" | "MODERATOR",
) {
  const { group } = await requireOwner(groupId);
  if (userId === group.ownerId) return;

  await prisma.groupMembership.update({
    where: { userId_groupId: { userId, groupId } },
    data: { role },
  });

  revalidatePath(`/gruppen/${slug}/einstellungen`);
}

export async function removeMember(groupId: string, userId: string, slug: string) {
  const { group } = await requireOwner(groupId);
  if (userId === group.ownerId) return;

  await prisma.groupMembership.deleteMany({ where: { userId, groupId } });

  revalidatePath(`/gruppen/${slug}`);
  revalidatePath(`/gruppen/${slug}/einstellungen`);
}

export async function approveJoinRequest(requestId: string, groupId: string, slug: string) {
  await requireOwnerOrModerator(groupId);

  const request = await prisma.groupJoinRequest.findUnique({ where: { id: requestId } });
  if (!request) return;

  await prisma.groupMembership.upsert({
    where: { userId_groupId: { userId: request.userId, groupId } },
    update: {},
    create: { userId: request.userId, groupId },
  });
  await prisma.groupJoinRequest.delete({ where: { id: requestId } });

  revalidatePath(`/gruppen/${slug}`);
  revalidatePath("/gruppen");
}

export async function denyJoinRequest(requestId: string, groupId: string, slug: string) {
  await requireOwnerOrModerator(groupId);
  await prisma.groupJoinRequest.delete({ where: { id: requestId } });
  revalidatePath(`/gruppen/${slug}`);
}

export async function createGroupPost(groupId: string, slug: string, formData: FormData) {
  const user = await requireMember(groupId);
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await prisma.groupPost.create({ data: { groupId, authorId: user.id, content } });
  revalidatePath(`/gruppen/${slug}`);
}

async function uniqueEventSlug(base: string) {
  const root = slugify(base) || "veranstaltung";
  let slug = root;
  let n = 1;
  while (await prisma.event.findFirst({ where: { slug } })) {
    n += 1;
    slug = `${root}-${n}`;
  }
  return slug;
}

export async function createGroupEvent(groupId: string, slug: string, formData: FormData) {
  const { group } = await requireOwner(groupId);
  if (group.tag !== "PRIVATE_VERANSTALTUNG") {
    throw new Error('Dafür muss die Gruppe das Tag "Private Veranstaltung" haben.');
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startDateRaw = String(formData.get("startDate") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const isPublic = formData.get("public") === "on";

  if (!title || !description || !startDateRaw) {
    throw new Error("Titel, Beschreibung und Beginn sind erforderlich.");
  }

  const eventSlug = await uniqueEventSlug(title);

  await prisma.event.create({
    data: {
      title,
      slug: eventSlug,
      description: sanitizeRichText(description),
      location: location || null,
      startDate: new Date(startDateRaw),
      coverImage: coverImage || null,
      capacity: capacityRaw ? Number(capacityRaw) : null,
      published: true,
      groupId,
    },
  });

  await prisma.group.update({ where: { id: groupId }, data: { public: isPublic } });

  revalidatePath(`/gruppen/${slug}`);
  revalidatePath("/veranstaltungen");
  redirect(`/gruppen/${slug}`);
}

export async function replyToGroupPost(
  postId: string,
  groupId: string,
  slug: string,
  formData: FormData,
) {
  const user = await requireMember(groupId);
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await prisma.groupPostReply.create({ data: { postId, authorId: user.id, content } });
  revalidatePath(`/gruppen/${slug}`);
}

export async function createGroupPoll(groupId: string, slug: string, formData: FormData) {
  await requireOwner(groupId);
  const question = String(formData.get("question") ?? "").trim();
  const options = [
    String(formData.get("option1") ?? "").trim(),
    String(formData.get("option2") ?? "").trim(),
    String(formData.get("option3") ?? "").trim(),
    String(formData.get("option4") ?? "").trim(),
  ].filter(Boolean);

  if (!question || options.length < 2) {
    throw new Error("Frage und mindestens 2 Antwortoptionen sind erforderlich.");
  }

  await prisma.groupPoll.create({
    data: {
      groupId,
      question,
      options: {
        create: options.map((label, index) => ({ label, order: index })),
      },
    },
  });

  revalidatePath(`/gruppen/${slug}`);
  redirect(`/gruppen/${slug}`);
}

export async function voteOnPoll(
  pollId: string,
  optionId: string,
  groupId: string,
  slug: string,
) {
  const user = await requireMember(groupId);

  await prisma.groupPollVote.upsert({
    where: { pollId_userId: { pollId, userId: user.id } },
    update: { optionId },
    create: { pollId, optionId, userId: user.id },
  });

  revalidatePath(`/gruppen/${slug}`);
}

export async function deleteGroupPoll(pollId: string, groupId: string, slug: string) {
  await requireOwner(groupId);
  await prisma.groupPoll.delete({ where: { id: pollId } });
  revalidatePath(`/gruppen/${slug}`);
}

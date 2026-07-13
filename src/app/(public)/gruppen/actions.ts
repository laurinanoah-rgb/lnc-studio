"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/slugify";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

async function uniqueSlug(base: string) {
  const root = slugify(base) || "gruppe";
  let slug = root;
  let n = 1;
  while (await prisma.group.findFirst({ where: { slug } })) {
    n += 1;
    slug = `${root}-${n}`;
  }
  return slug;
}

export async function createGroup(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();

  if (!name || !description) {
    throw new Error("Name und Beschreibung sind erforderlich.");
  }

  const slug = await uniqueSlug(name);

  const group = await prisma.group.create({
    data: {
      name,
      slug,
      description,
      coverImage: coverImage || null,
      ownerId: user.id,
      members: { create: { userId: user.id } },
    },
  });

  revalidatePath("/gruppen");
  redirect(`/gruppen/${group.slug}`);
}

export async function joinGroup(groupId: string, slug?: string) {
  const user = await requireUser();

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group || group.locked) return;

  await prisma.groupMembership.upsert({
    where: { userId_groupId: { userId: user.id, groupId } },
    update: {},
    create: { userId: user.id, groupId },
  });
  revalidatePath("/gruppen");
  if (slug) revalidatePath(`/gruppen/${slug}`);
}

export async function leaveGroup(groupId: string, slug?: string) {
  const user = await requireUser();
  await prisma.groupMembership.deleteMany({ where: { userId: user.id, groupId } });
  revalidatePath("/gruppen");
  if (slug) revalidatePath(`/gruppen/${slug}`);
}

export async function requestToJoin(groupId: string, slug?: string) {
  const user = await requireUser();

  await prisma.groupJoinRequest.upsert({
    where: { groupId_userId: { groupId, userId: user.id } },
    update: { status: "PENDING" },
    create: { groupId, userId: user.id },
  });

  revalidatePath("/gruppen");
  if (slug) revalidatePath(`/gruppen/${slug}`);
}

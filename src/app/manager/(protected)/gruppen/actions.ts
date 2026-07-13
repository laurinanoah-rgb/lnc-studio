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

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "gruppe";
  let slug = root;
  let n = 1;
  while (
    await prisma.group.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
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

  await prisma.group.create({
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
  revalidatePath("/manager/gruppen");
}

export async function updateGroup(id: string, formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();

  if (!name || !description) {
    throw new Error("Name und Beschreibung sind erforderlich.");
  }

  const existing = await prisma.group.findUnique({ where: { id } });
  if (!existing) throw new Error("Gruppe nicht gefunden.");

  const slug = existing.name === name ? existing.slug : await uniqueSlug(name, id);

  await prisma.group.update({
    where: { id },
    data: { name, slug, description, coverImage: coverImage || null },
  });

  revalidatePath("/gruppen");
  revalidatePath("/manager/gruppen");
}

export async function deleteGroup(id: string) {
  await requireUser();
  await prisma.group.delete({ where: { id } });
  revalidatePath("/gruppen");
  revalidatePath("/manager/gruppen");
}

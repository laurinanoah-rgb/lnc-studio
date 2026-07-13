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
  const root = slugify(base) || "beitrag";
  let slug = root;
  let n = 1;
  while (
    await prisma.post.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${root}-${n}`;
  }
  return slug;
}

export async function createPost(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !content) {
    throw new Error("Titel und Inhalt sind erforderlich.");
  }

  const slug = await uniqueSlug(title);

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      published,
      authorId: user.id,
    },
  });

  revalidatePath("/updates");
  revalidatePath("/manager/updates");
  redirect("/manager/updates");
}

export async function updatePost(id: string, formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !content) {
    throw new Error("Titel und Inhalt sind erforderlich.");
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Beitrag nicht gefunden.");

  const slug = existing.title === title ? existing.slug : await uniqueSlug(title, id);

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      published,
    },
  });

  revalidatePath("/updates");
  revalidatePath(`/updates/${slug}`);
  revalidatePath("/manager/updates");
  redirect("/manager/updates");
}

export async function deletePost(id: string) {
  await requireUser();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/updates");
  revalidatePath("/manager/updates");
}

export async function togglePublish(id: string, published: boolean) {
  await requireUser();
  await prisma.post.update({ where: { id }, data: { published } });
  revalidatePath("/updates");
  revalidatePath("/manager/updates");
}

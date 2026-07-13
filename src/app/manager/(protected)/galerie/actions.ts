"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function addGalleryImage(url: string, title?: string) {
  await requireUser();
  const maxOrder = await prisma.galleryImage.aggregate({ _max: { order: true } });

  await prisma.galleryImage.create({
    data: {
      url,
      title: title || null,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  revalidatePath("/galerie");
  revalidatePath("/manager/galerie");
}

export async function updateGalleryImage(id: string, formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  await prisma.galleryImage.update({
    where: { id },
    data: {
      title: title || null,
      description: description || null,
      category: category || null,
    },
  });

  revalidatePath("/galerie");
  revalidatePath("/manager/galerie");
}

export async function deleteGalleryImage(id: string) {
  await requireUser();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/galerie");
  revalidatePath("/manager/galerie");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/slugify";
import { sanitizeRichText } from "@/lib/sanitize";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "veranstaltung";
  let slug = root;
  let n = 1;
  while (
    await prisma.event.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${root}-${n}`;
  }
  return slug;
}

function readEventFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startDateRaw = String(formData.get("startDate") ?? "");
  const endDateRaw = String(formData.get("endDate") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const promoVideo = String(formData.get("promoVideo") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !description || !startDateRaw) {
    throw new Error("Titel, Beschreibung und Beginn sind erforderlich.");
  }

  return {
    title,
    description: sanitizeRichText(description),
    location: location || null,
    startDate: new Date(startDateRaw),
    endDate: endDateRaw ? new Date(endDateRaw) : null,
    coverImage: coverImage || null,
    promoVideo: promoVideo || null,
    capacity: capacityRaw ? Number(capacityRaw) : null,
    published,
  };
}

export async function createEvent(formData: FormData) {
  await requireUser();
  const data = readEventFields(formData);
  const slug = await uniqueSlug(data.title);

  await prisma.event.create({ data: { ...data, slug } });

  revalidatePath("/veranstaltungen");
  revalidatePath("/manager/veranstaltungen");
  redirect("/manager/veranstaltungen");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireUser();
  const data = readEventFields(formData);

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new Error("Veranstaltung nicht gefunden.");

  const slug = existing.title === data.title ? existing.slug : await uniqueSlug(data.title, id);

  await prisma.event.update({ where: { id }, data: { ...data, slug } });

  revalidatePath("/veranstaltungen");
  revalidatePath(`/veranstaltungen/${slug}`);
  revalidatePath("/manager/veranstaltungen");
  redirect("/manager/veranstaltungen");
}

export async function deleteEvent(id: string) {
  await requireUser();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/veranstaltungen");
  revalidatePath("/manager/veranstaltungen");
}

export async function toggleEventPublish(id: string, published: boolean) {
  await requireUser();
  await prisma.event.update({ where: { id }, data: { published } });
  revalidatePath("/veranstaltungen");
  revalidatePath("/manager/veranstaltungen");
}

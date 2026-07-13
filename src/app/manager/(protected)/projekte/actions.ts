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

function readProjectFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const linkLabel = String(formData.get("linkLabel") ?? "").trim();
  const linkUrl = String(formData.get("linkUrl") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !description) {
    throw new Error("Titel und Beschreibung sind erforderlich.");
  }

  return {
    title,
    description,
    linkLabel: linkLabel || null,
    linkUrl: linkUrl || null,
    icon: icon || null,
    published,
  };
}

export async function createProject(formData: FormData) {
  await requireUser();
  const data = readProjectFields(formData);
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });

  await prisma.project.create({ data: { ...data, order: (maxOrder._max.order ?? 0) + 1 } });

  revalidatePath("/projekte");
  revalidatePath("/manager/projekte");
}

export async function updateProject(id: string, formData: FormData) {
  await requireUser();
  const data = readProjectFields(formData);
  await prisma.project.update({ where: { id }, data });
  revalidatePath("/projekte");
  revalidatePath("/manager/projekte");
}

export async function deleteProject(id: string) {
  await requireUser();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projekte");
  revalidatePath("/manager/projekte");
}

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

function readEquipmentFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!name) {
    throw new Error("Name ist erforderlich.");
  }

  return {
    name,
    imageUrl: imageUrl || null,
    condition: condition || null,
    published,
  };
}

function readIncludedAccessoryFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!name) {
    throw new Error("Name ist erforderlich.");
  }

  return { name, published };
}

export async function createEquipmentItem(formData: FormData) {
  await requireUser();
  const data = readEquipmentFields(formData);
  const maxOrder = await prisma.equipmentItem.aggregate({ _max: { order: true } });

  await prisma.equipmentItem.create({
    data: { ...data, order: (maxOrder._max.order ?? 0) + 1 },
  });

  revalidatePath("/anfrage");
  revalidatePath("/manager/ausstattung");
}

export async function updateEquipmentItem(id: string, formData: FormData) {
  await requireUser();
  const data = readEquipmentFields(formData);
  await prisma.equipmentItem.update({ where: { id }, data });
  revalidatePath("/anfrage");
  revalidatePath("/manager/ausstattung");
}

export async function deleteEquipmentItem(id: string) {
  await requireUser();
  await prisma.equipmentItem.delete({ where: { id } });
  revalidatePath("/anfrage");
  revalidatePath("/manager/ausstattung");
}

export async function createIncludedAccessory(formData: FormData) {
  await requireUser();
  const data = readIncludedAccessoryFields(formData);
  const maxOrder = await prisma.includedAccessory.aggregate({ _max: { order: true } });

  await prisma.includedAccessory.create({
    data: { ...data, order: (maxOrder._max.order ?? 0) + 1 },
  });

  revalidatePath("/anfrage");
  revalidatePath("/manager/ausstattung");
}

export async function updateIncludedAccessory(id: string, formData: FormData) {
  await requireUser();
  const data = readIncludedAccessoryFields(formData);
  await prisma.includedAccessory.update({ where: { id }, data });
  revalidatePath("/anfrage");
  revalidatePath("/manager/ausstattung");
}

export async function deleteIncludedAccessory(id: string) {
  await requireUser();
  await prisma.includedAccessory.delete({ where: { id } });
  revalidatePath("/anfrage");
  revalidatePath("/manager/ausstattung");
}

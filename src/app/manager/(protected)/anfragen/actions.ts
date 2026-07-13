"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { InquiryStatus } from "@prisma/client";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function updateInquiryStatus(id: string, formData: FormData) {
  await requireUser();
  const status = formData.get("status") as InquiryStatus;
  await prisma.inquiryRequest.update({ where: { id }, data: { status } });
  revalidatePath("/manager/anfragen");
}

export async function deleteInquiry(id: string) {
  await requireUser();
  await prisma.inquiryRequest.delete({ where: { id } });
  revalidatePath("/manager/anfragen");
}

export async function updateAnfrageSettings(formData: FormData) {
  await requireUser();
  const introText = String(formData.get("introText") ?? "").trim();

  await prisma.anfrageSettings.upsert({
    where: { id: "singleton" },
    update: { introText },
    create: { id: "singleton", introText },
  });

  revalidatePath("/anfrage");
  revalidatePath("/manager/anfragen");
}

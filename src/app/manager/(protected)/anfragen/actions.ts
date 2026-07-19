"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendInquiryApprovedEmail, sendInquiryRejectedEmail } from "@/lib/inquiry-email";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function approveInquiry(id: string) {
  await requireUser();
  const inquiry = await prisma.inquiryRequest.update({ where: { id }, data: { status: "GENEHMIGT" } });
  try {
    await sendInquiryApprovedEmail(inquiry);
  } catch (error) {
    console.error("Fehler beim Senden der Genehmigungs-E-Mail:", error);
  }
  revalidatePath("/manager/anfragen");
}

export async function rejectInquiry(id: string) {
  await requireUser();
  const inquiry = await prisma.inquiryRequest.update({ where: { id }, data: { status: "ABGELEHNT" } });
  try {
    await sendInquiryRejectedEmail(inquiry);
  } catch (error) {
    console.error("Fehler beim Senden der Ablehnungs-E-Mail:", error);
  }
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

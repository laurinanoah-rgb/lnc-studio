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

function readFaqFields(formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();

  if (!category || !question || !answer) {
    throw new Error("Kategorie, Frage und Antwort sind erforderlich.");
  }

  return { category, question, answer };
}

export async function createFaqItem(formData: FormData) {
  await requireUser();
  const data = readFaqFields(formData);
  const maxOrder = await prisma.faqItem.aggregate({ _max: { order: true } });

  await prisma.faqItem.create({ data: { ...data, order: (maxOrder._max.order ?? 0) + 1 } });

  revalidatePath("/faq");
  revalidatePath("/manager/faq");
}

export async function updateFaqItem(id: string, formData: FormData) {
  await requireUser();
  const data = readFaqFields(formData);
  await prisma.faqItem.update({ where: { id }, data });
  revalidatePath("/faq");
  revalidatePath("/manager/faq");
}

export async function deleteFaqItem(id: string) {
  await requireUser();
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/faq");
  revalidatePath("/manager/faq");
}

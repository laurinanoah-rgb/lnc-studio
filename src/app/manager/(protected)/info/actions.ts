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

export async function updateSiteContent(key: string, formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  await prisma.siteContent.upsert({
    where: { key },
    update: { title, body },
    create: { key, title, body },
  });

  revalidatePath(`/${key}`);
  revalidatePath(`/manager/${key}`);
}

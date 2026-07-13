"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { Role } from "@prisma/client";

async function requireManager() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "MANAGER") {
    redirect("/manager");
  }
  return session.user;
}

export async function createUser(formData: FormData) {
  await requireManager();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "TEAM") as Role;

  if (!name || !email || password.length < 8) {
    throw new Error("Name, E-Mail und ein Passwort mit mindestens 8 Zeichen sind erforderlich.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Es existiert bereits ein Benutzer mit dieser E-Mail-Adresse.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath("/manager/benutzer");
}

export async function deleteUser(id: string) {
  const currentUser = await requireManager();
  if (id === currentUser.id) {
    throw new Error("Sie können sich nicht selbst löschen.");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/manager/benutzer");
}

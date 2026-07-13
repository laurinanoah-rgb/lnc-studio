"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { RsvpStatus } from "@prisma/client";

export async function setRsvp(eventId: string, slug: string, status: RsvpStatus) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/veranstaltungen/${slug}`)}`);
  }

  await prisma.eventRsvp.upsert({
    where: { eventId_userId: { eventId, userId: session.user.id } },
    update: { status },
    create: { eventId, userId: session.user.id, status },
  });

  revalidatePath(`/veranstaltungen/${slug}`);
}

export async function postEventComment(eventId: string, slug: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/veranstaltungen/${slug}`)}`);
  }

  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await prisma.eventComment.create({
    data: { eventId, authorId: session.user.id, content },
  });

  revalidatePath(`/veranstaltungen/${slug}`);
}

export async function deleteEventComment(commentId: string, slug: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const comment = await prisma.eventComment.findUnique({ where: { id: commentId } });
  if (!comment) return;

  const isAuthor = comment.authorId === session.user.id;
  const isStaff = session.user.role === "MANAGER" || session.user.role === "TEAM";
  if (!isAuthor && !isStaff) {
    throw new Error("Keine Berechtigung.");
  }

  await prisma.eventComment.delete({ where: { id: commentId } });
  revalidatePath(`/veranstaltungen/${slug}`);
}

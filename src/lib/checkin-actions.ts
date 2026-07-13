"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { canManageEvent } from "@/lib/event-access";

export async function toggleCheckIn(rsvpId: string, slug: string, checked: boolean) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const rsvp = await prisma.eventRsvp.findUnique({
    where: { id: rsvpId },
    include: { event: true },
  });
  if (!rsvp) return;

  const allowed = await canManageEvent(rsvp.event, session.user.id, session.user.role);
  if (!allowed) {
    throw new Error("Keine Berechtigung.");
  }

  await prisma.eventRsvp.update({
    where: { id: rsvpId },
    data: { checkedInAt: checked ? new Date() : null },
  });

  revalidatePath(`/veranstaltungen/${slug}/checkin`);
  revalidatePath(`/checkin/${rsvp.checkInCode}`);
}

export async function checkInByCode(code: string) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/checkin/${code}`)}`);
  }

  const rsvp = await prisma.eventRsvp.findUnique({
    where: { checkInCode: code },
    include: { event: true },
  });
  if (!rsvp) {
    throw new Error("Check-in-Code nicht gefunden.");
  }

  const allowed = await canManageEvent(rsvp.event, session.user.id, session.user.role);
  if (!allowed) {
    throw new Error("Keine Berechtigung zum Einchecken.");
  }

  await prisma.eventRsvp.update({
    where: { id: rsvp.id },
    data: { checkedInAt: new Date() },
  });

  revalidatePath(`/checkin/${code}`);
  revalidatePath(`/veranstaltungen/${rsvp.event.slug}/checkin`);
}

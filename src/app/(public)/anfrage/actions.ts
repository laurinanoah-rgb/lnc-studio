"use server";

import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/schemas";

export async function submitInquiry(values: unknown) {
  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return { success: false as const, error: "Bitte überprüfe deine Eingaben." };
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    eventAddress,
    days,
    neededDate,
    neededTime,
    eventDescription,
    liabilityAccepted,
  } = parsed.data;

  await prisma.inquiryRequest.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      eventAddress,
      days: Number(days),
      neededAt: new Date(`${neededDate}T${neededTime}`),
      eventDescription: eventDescription || null,
      liabilityAccepted,
    },
  });

  return { success: true as const };
}

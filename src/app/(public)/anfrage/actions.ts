"use server";

import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/schemas";
import { sendInquiryReceivedEmail } from "@/lib/inquiry-email";

export async function submitInquiry(values: unknown) {
  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return { success: false as const, error: "Bitte überprüfe deine Eingaben." };
  }

  const {
    firstName,
    lastName,
    organization,
    email,
    phone,
    eventAddress,
    days,
    neededDate,
    neededTime,
    eventDescription,
    equipment,
    liabilityAccepted,
    privacyAccepted,
  } = parsed.data;

  const requestedQuantities = (equipment ?? []).filter((entry) => entry.quantity > 0);
  type EquipmentSnapshotEntry = { itemId: string; name: string; quantity: number; condition: string | null };
  let equipmentRequest: EquipmentSnapshotEntry[] | null = null;

  if (requestedQuantities.length > 0) {
    const items = await prisma.equipmentItem.findMany({
      where: { id: { in: requestedQuantities.map((entry) => entry.itemId) } },
    });
    const itemsById = new Map(items.map((item) => [item.id, item]));

    equipmentRequest = requestedQuantities
      .map((entry) => {
        const item = itemsById.get(entry.itemId);
        return item
          ? { itemId: item.id, name: item.name, quantity: entry.quantity, condition: item.condition }
          : null;
      })
      .filter((entry): entry is EquipmentSnapshotEntry => entry !== null);
  }

  const includedItems = await prisma.includedAccessory.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  const includedAccessories = includedItems.map((item) => item.name);

  const inquiry = await prisma.inquiryRequest.create({
    data: {
      firstName,
      lastName,
      organization: organization || null,
      email,
      phone,
      eventAddress,
      days: Number(days),
      neededAt: new Date(`${neededDate}T${neededTime}`),
      eventDescription: eventDescription || null,
      equipmentRequest: equipmentRequest ?? undefined,
      includedAccessories,
      liabilityAccepted,
      privacyAccepted,
    },
  });

  try {
    await sendInquiryReceivedEmail(inquiry);
  } catch (error) {
    console.error("Fehler beim Senden der Bestätigungs-E-Mail:", error);
  }

  return { success: true as const };
}

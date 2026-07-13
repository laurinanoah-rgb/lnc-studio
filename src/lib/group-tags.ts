import type { GroupTag } from "@prisma/client";

export const groupTagLabels: Record<GroupTag, string> = {
  PRIVATE_VERANSTALTUNG: "Private Veranstaltung",
  PRIVATES_ROLLENSPIEL: "Privates Rollenspiel",
  ZUSAMMEN_QUATSCHEN: "Zusammen Quatschen",
  SONSTIGES: "Sonstiges",
};

export const groupTagOptions = Object.entries(groupTagLabels) as [GroupTag, string][];

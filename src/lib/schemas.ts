import { z } from "zod";

export const inquirySchema = z.object({
  firstName: z.string().min(1, "Bitte gib deinen Vornamen an."),
  lastName: z.string().min(1, "Bitte gib deinen Nachnamen an."),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse an."),
  phone: z.string().min(3, "Bitte gib deine Telefonnummer an."),
  eventAddress: z.string().min(3, "Bitte gib die Adresse der Veranstaltung an."),
  days: z
    .string()
    .min(1, "Bitte gib die Anzahl der Tage an.")
    .refine((value) => {
      const n = Number(value);
      return Number.isInteger(n) && n >= 1 && n <= 30;
    }, "Bitte eine Zahl zwischen 1 und 30 angeben."),
  neededDate: z.string().min(1, "Bitte wähle ein Datum."),
  neededTime: z.string().min(1, "Bitte wähle eine Uhrzeit."),
  eventDescription: z.string().optional(),
  liabilityAccepted: z.boolean().refine((value) => value === true, {
    message: "Bitte akzeptiere die Haftungsbedingungen.",
  }),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

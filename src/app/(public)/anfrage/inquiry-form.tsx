"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/lib/schemas";
import { submitInquiry } from "./actions";

type EquipmentItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  condition: string | null;
};

export function InquiryForm({ equipmentItems }: { equipmentItems: EquipmentItem[] }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { days: "1", liabilityAccepted: false, privacyAccepted: false },
  });

  const address = watch("eventAddress");
  const [mapAddress, setMapAddress] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMapAddress(address && address.trim().length >= 3 ? address.trim() : "");
    }, 600);
    return () => clearTimeout(timeout);
  }, [address]);

  async function onSubmit(values: InquiryFormValues) {
    setStatus("idle");
    const equipment = Object.entries(quantities)
      .map(([itemId, quantity]) => ({ itemId, quantity: Number(quantity) || 0 }))
      .filter((entry) => entry.quantity > 0);

    const result = await submitInquiry({ ...values, equipment });
    if (result.success) {
      setStatus("success");
      reset();
      setMapAddress("");
      setQuantities({});
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-lg font-medium">Danke für deine Anfrage! 🎉</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Wir melden uns so schnell wie möglich bei dir.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-accent hover:underline"
        >
          Weitere Anfrage stellen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm text-muted-foreground">
            Vorname
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm text-muted-foreground">
            Nachname
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="text-sm text-muted-foreground">
          Organisation / Verein (optional)
        </label>
        <input
          id="organization"
          {...register("organization")}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm text-muted-foreground">
            E-Mail-Adresse
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm text-muted-foreground">
            Telefonnummer
          </label>
          <input
            id="phone"
            {...register("phone")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="eventAddress" className="text-sm text-muted-foreground">
          Adresse von der Veranstaltung
        </label>
        <input
          id="eventAddress"
          {...register("eventAddress")}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {errors.eventAddress && (
          <p className="mt-1 text-xs text-red-400">{errors.eventAddress.message}</p>
        )}
        {mapAddress && (
          <div className="mt-2 overflow-hidden rounded-lg border border-border">
            <iframe
              title="Kartenvorschau"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
              className="h-48 w-full"
              loading="lazy"
            />
            <p className="border-t border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              Vorschau – bitte prüfen, ob der Ort stimmt.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="days" className="text-sm text-muted-foreground">
            Wie viele Tage?
          </label>
          <input
            id="days"
            type="number"
            min={1}
            max={30}
            {...register("days")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.days && <p className="mt-1 text-xs text-red-400">{errors.days.message}</p>}
        </div>
        <div>
          <label htmlFor="neededDate" className="text-sm text-muted-foreground">
            Wann brauchst du es?
          </label>
          <input
            id="neededDate"
            type="date"
            {...register("neededDate")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.neededDate && (
            <p className="mt-1 text-xs text-red-400">{errors.neededDate.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="neededTime" className="text-sm text-muted-foreground">
            Um wieviel Uhr?
          </label>
          <input
            id="neededTime"
            type="time"
            {...register("neededTime")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.neededTime && (
            <p className="mt-1 text-xs text-red-400">{errors.neededTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="eventDescription" className="text-sm text-muted-foreground">
          Um was geht die Veranstaltung? (optional)
        </label>
        <textarea
          id="eventDescription"
          rows={4}
          {...register("eventDescription")}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {equipmentItems.length > 0 && (
        <details className="rounded-lg border border-border bg-background px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            🔊 Zusätzliche Ausstattung (optional)
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            {equipmentItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-lg border border-border bg-surface" />
                )}
                <span className="flex-1 text-sm text-foreground">
                  {item.name}
                  {item.condition && (
                    <span className="ml-2 text-xs text-muted-foreground">({item.condition})</span>
                  )}
                </span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  placeholder="max. 2"
                  value={quantities[item.id] ?? ""}
                  onChange={(event) =>
                    setQuantities((prev) => ({ ...prev, [item.id]: event.target.value }))
                  }
                  className="w-20 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>
        </details>
      )}

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          {...register("liabilityAccepted")}
          className="mt-0.5 h-4 w-4 rounded border-border"
        />
        Ich hafte für Schäden, Verlust oder übermäßigen Verschleiß der überlassenen PA-Anlage und
        des Zubehörs während der gesamten Ausleihdauer – unabhängig davon, ob der Schaden durch
        mich selbst, weitere anwesende Personen oder Dritte verursacht wird. Ich verpflichte mich,
        die Ausrüstung im ordnungsgemäßen Zustand zurückzugeben, und trage die Kosten für
        Reparatur oder Ersatz bei Beschädigung oder Verlust.
      </label>
      {errors.liabilityAccepted && (
        <p className="-mt-3 text-xs text-red-400">{errors.liabilityAccepted.message}</p>
      )}

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          {...register("privacyAccepted")}
          className="mt-0.5 h-4 w-4 rounded border-border"
        />
        Ich habe die{" "}
        <a href="/datenschutz" target="_blank" className="text-accent hover:underline">
          Datenschutzerklärung
        </a>{" "}
        gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung dieser Anfrage
        einverstanden.
      </label>
      {errors.privacyAccepted && (
        <p className="-mt-3 text-xs text-red-400">{errors.privacyAccepted.message}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Diese Anfrage ist unverbindlich – die endgültigen Bedingungen werden bei Abholung/Übergabe
        gemeinsam besprochen. Übergabe und Rückgabe werden dokumentiert (z. B. Fotos vom Zustand).
      </p>

      {status === "error" && (
        <p className="text-sm text-red-400">
          Es ist ein Fehler aufgetreten. Bitte versuche es erneut.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {isSubmitting ? "Wird gesendet…" : "Absenden"}
      </button>
    </form>
  );
}

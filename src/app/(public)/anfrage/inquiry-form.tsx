"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/lib/schemas";
import { submitInquiry } from "./actions";

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { days: "1", liabilityAccepted: false },
  });

  async function onSubmit(values: InquiryFormValues) {
    setStatus("idle");
    const result = await submitInquiry(values);
    if (result.success) {
      setStatus("success");
      reset();
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

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          {...register("liabilityAccepted")}
          className="mt-0.5 h-4 w-4 rounded border-border"
        />
        Ich erkläre mich bereit, die Kosten für Schäden an den gemieteten PA-Boxen zu
        übernehmen.
      </label>
      {errors.liabilityAccepted && (
        <p className="-mt-3 text-xs text-red-400">{errors.liabilityAccepted.message}</p>
      )}

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

import type { Metadata } from "next";
import Link from "next/link";
import { EventForm } from "../event-form";
import { createEvent } from "../actions";

export const metadata: Metadata = { title: "Neue Veranstaltung" };

export default function NewEventPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/manager/veranstaltungen"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Zurück zu Veranstaltungen
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Neue Veranstaltung</h1>
      <div className="mt-6">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}

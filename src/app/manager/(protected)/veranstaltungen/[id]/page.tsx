import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../event-form";
import { updateEvent } from "../actions";

export const metadata: Metadata = { title: "Veranstaltung bearbeiten" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const action = updateEvent.bind(null, event.id);

  return (
    <div className="max-w-2xl">
      <Link
        href="/manager/veranstaltungen"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Zurück zu Veranstaltungen
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Veranstaltung bearbeiten</h1>
      <div className="mt-6">
        <EventForm action={action} event={event} />
      </div>
    </div>
  );
}

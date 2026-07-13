import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { deleteEvent, toggleEventPublish } from "./actions";
import { DeleteButton } from "@/components/manager/delete-button";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Veranstaltungen" };

export default async function ManagerEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: { rsvps: { select: { status: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Veranstaltungen</h1>
          <p className="mt-1 text-sm text-muted-foreground">Termine verwalten.</p>
        </div>
        <Link
          href="/manager/veranstaltungen/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          Neue Veranstaltung
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium">Beginn</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Zu-/Absagen</th>
              <th className="px-4 py-3 text-right font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const zusagen = event.rsvps.filter((rsvp) => rsvp.status === "ZUSAGE").length;
              const absagen = event.rsvps.filter((rsvp) => rsvp.status === "ABSAGE").length;

              return (
                <tr key={event.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{event.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(event.startDate)}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleEventPublish.bind(null, event.id, !event.published)}>
                      <button
                        type="submit"
                        className={
                          event.published
                            ? "rounded-full bg-accent/20 px-3 py-1 text-xs text-accent"
                            : "rounded-full bg-surface-hover px-3 py-1 text-xs text-muted-foreground"
                        }
                      >
                        {event.published ? "Veröffentlicht" : "Entwurf"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
                        ✅ {zusagen}
                      </span>
                      <span className="rounded-full bg-surface-hover px-3 py-1 text-xs text-muted-foreground">
                        ❌ {absagen}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/manager/veranstaltungen/${event.id}`}
                        className="text-accent hover:underline"
                      >
                        Bearbeiten
                      </Link>
                      <DeleteButton action={deleteEvent.bind(null, event.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Noch keine Veranstaltungen vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

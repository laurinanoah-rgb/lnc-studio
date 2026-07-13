import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { canManageEvent } from "@/lib/event-access";
import { toggleCheckIn } from "@/lib/checkin-actions";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Check-in" };

export default async function CheckinListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      rsvps: {
        where: { status: "ZUSAGE" },
        orderBy: { respondedAt: "asc" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  if (!event) notFound();

  const allowed = await canManageEvent(event, session?.user?.id, session?.user?.role);
  if (!allowed) notFound();

  const checkedInCount = event.rsvps.filter((rsvp) => rsvp.checkedInAt).length;

  return (
    <Container className="max-w-2xl py-16">
      <Link
        href={`/veranstaltungen/${event.slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Zurück zur Veranstaltung
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Check-in: {event.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {checkedInCount} / {event.rsvps.length} eingecheckt
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {event.rsvps.map((rsvp) => (
          <Card key={rsvp.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{rsvp.user.name}</p>
              {rsvp.checkedInAt && (
                <p className="text-xs text-muted-foreground">
                  Eingecheckt um {formatDateTime(rsvp.checkedInAt)}
                </p>
              )}
            </div>
            <form action={toggleCheckIn.bind(null, rsvp.id, event.slug, !rsvp.checkedInAt)}>
              <button
                type="submit"
                className={
                  rsvp.checkedInAt
                    ? "rounded-full bg-accent/20 px-4 py-2 text-sm text-accent"
                    : "rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover"
                }
              >
                {rsvp.checkedInAt ? "✅ Eingecheckt" : "Einchecken"}
              </button>
            </form>
          </Card>
        ))}
        {event.rsvps.length === 0 && <p className="text-muted-foreground">Noch keine Zusagen.</p>}
      </div>
    </Container>
  );
}

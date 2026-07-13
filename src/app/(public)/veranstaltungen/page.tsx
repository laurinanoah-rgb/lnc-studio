import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatDateTime } from "@/lib/format";
import { googleMapsDirectionsUrl } from "@/lib/maps";
import { EventCountdownBadge } from "@/components/event-countdown-badge";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Veranstaltungen" };

export default async function VeranstaltungenPage() {
  const now = new Date();
  const visibility = { OR: [{ groupId: null }, { group: { is: { public: true } } }] };
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { published: true, startDate: { gte: now }, ...visibility },
      orderBy: { startDate: "asc" },
      include: {
        group: { select: { name: true, slug: true } },
        _count: { select: { rsvps: { where: { status: "ZUSAGE" } } } },
      },
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { lt: now }, ...visibility },
      orderBy: { startDate: "desc" },
      take: 10,
      include: {
        group: { select: { name: true, slug: true } },
        _count: { select: { rsvps: { where: { status: "ZUSAGE" } } } },
      },
    }),
  ]);

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">🎉 Veranstaltungen</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Alle Termine im Überblick.</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Kommende Termine</h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Aktuell sind keine Termine geplant.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {upcoming.map((event, index) => (
              <Reveal key={event.id} delay={(index % 4) * 0.06}>
                <EventCard event={event} attendeeCount={event._count.rsvps} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">Vergangene Termine</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event.id} event={event} attendeeCount={event._count.rsvps} muted />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

function EventCard({
  event,
  attendeeCount,
  muted,
}: {
  event: {
    slug: string;
    title: string;
    location: string | null;
    startDate: Date;
    coverImage: string | null;
    group: { name: string; slug: string } | null;
  };
  attendeeCount: number;
  muted?: boolean;
}) {
  return (
    <Card className={muted ? "opacity-70" : undefined}>
      {event.coverImage && (
        <div className="relative -mx-6 -mt-6 mb-4">
          {!muted && <EventCountdownBadge startDate={event.startDate} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImage}
            alt=""
            className="aspect-video w-full rounded-t-2xl object-cover"
          />
        </div>
      )}
      {event.group && (
        <Link
          href={`/gruppen/${event.group.slug}`}
          className="mb-1 inline-block text-xs text-muted-foreground hover:text-foreground"
        >
          👨‍👨‍👦‍👦 {event.group.name}
        </Link>
      )}
      <p className="text-xs text-accent">{formatDateTime(event.startDate)}</p>
      <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
      {event.location && (
        <a
          href={googleMapsDirectionsUrl(event.location)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm text-muted-foreground underline decoration-dotted hover:text-foreground"
        >
          📍 {event.location}
        </a>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        {attendeeCount === 0
          ? "Noch niemand hat zugesagt"
          : `${attendeeCount} ${attendeeCount === 1 ? "Zusage" : "Zusagen"}`}
      </p>
      <Link
        href={`/veranstaltungen/${event.slug}`}
        className="mt-3 inline-block text-sm text-accent hover:underline"
      >
        Details ansehen →
      </Link>
    </Card>
  );
}

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { ShareButton } from "@/components/share-button";
import { EventCountdownBadge } from "@/components/event-countdown-badge";
import { CountdownTimer } from "@/components/countdown-timer";
import { CapacityBar } from "@/components/capacity-bar";
import { RsvpButtons } from "./rsvp-buttons";
import { EventDiscussion } from "./event-discussion";
import { formatDateTime } from "@/lib/format";
import { googleMapsDirectionsUrl } from "@/lib/maps";
import { canViewEvent, canManageEvent } from "@/lib/event-access";
import { generateQrDataUrl } from "@/lib/qrcode";

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  return { title: event?.title ?? "Veranstaltung" };
}

export default async function EventDetailPage({
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
        include: { user: { select: { id: true, name: true } } },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!event || !event.published) notFound();

  const allowed = await canViewEvent(event, session?.user?.id);
  if (!allowed) notFound();

  const myRsvp = session?.user
    ? await prisma.eventRsvp.findUnique({
        where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
      })
    : null;

  const baseUrl = await getBaseUrl();
  const canManage = await canManageEvent(event, session?.user?.id, session?.user?.role);
  const isStaff = session?.user?.role === "MANAGER" || session?.user?.role === "TEAM";

  const myQrCode =
    myRsvp?.status === "ZUSAGE"
      ? await generateQrDataUrl(`${baseUrl}/checkin/${myRsvp.checkInCode}`)
      : null;

  return (
    <Container className="max-w-5xl py-16">
      <Link
        href="/veranstaltungen"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Zurück zu Veranstaltungen
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-accent">{formatDateTime(event.startDate)}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                {event.title}
              </h1>
            </div>
            <CountdownTimer target={event.startDate} compact />
          </div>

          {event.location && (
            <a
              href={googleMapsDirectionsUrl(event.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground underline decoration-dotted hover:text-foreground"
            >
              📍 {event.location} · Route berechnen
            </a>
          )}

          <div className="relative mt-8">
            <EventCountdownBadge startDate={event.startDate} />
            {event.promoVideo ? (
              <video
                src={event.promoVideo}
                controls
                poster={event.coverImage ?? undefined}
                className="w-full rounded-2xl border border-border"
              />
            ) : (
              event.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.coverImage}
                  alt=""
                  className="w-full rounded-2xl border border-border object-cover"
                />
              )
            )}
          </div>

          <div
            className="rich-content mt-8 text-foreground/90"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`/api/veranstaltungen/${event.slug}/ics`}
              className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover"
            >
              📅 Zum Kalender hinzufügen
            </a>
            {canManage && (
              <Link
                href={`/veranstaltungen/${event.slug}/checkin`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover"
              >
                🎟️ Check-in-Liste
              </Link>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">Kommst du?</h2>
            {session?.user ? (
              <div className="mt-4">
                <RsvpButtons
                  eventId={event.id}
                  slug={event.slug}
                  currentStatus={myRsvp?.status ?? null}
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(`/veranstaltungen/${event.slug}`)}`}
                  className="text-accent hover:underline"
                >
                  Melde dich an
                </Link>
                , um zu antworten.
              </p>
            )}

            {event.capacity && (
              <div className="mt-6">
                <CapacityBar current={event.rsvps.length} capacity={event.capacity} />
              </div>
            )}

            <p className="mt-6 text-sm text-muted-foreground">
              {event.rsvps.length === 0
                ? "Noch niemand hat zugesagt."
                : `${event.rsvps.length} ${event.rsvps.length === 1 ? "Person kommt" : "Personen kommen"}:`}
            </p>
            {event.rsvps.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {event.rsvps.map((rsvp) => (
                  <span
                    key={rsvp.id}
                    className="rounded-full bg-surface-hover px-3 py-1 text-xs text-foreground"
                  >
                    {rsvp.user.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {myQrCode && (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center sm:flex-row sm:text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={myQrCode} alt="Dein Check-in-QR-Code" className="h-32 w-32 rounded-lg" />
              <div>
                <h2 className="text-lg font-semibold">Dein Check-in-Code 🎟️</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Zeig diesen QR-Code beim Einlass vor – dann geht's schnell.
                </p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {myRsvp?.checkInCode.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <ShareButton title={event.title} url={`${baseUrl}/veranstaltungen/${event.slug}`} />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <EventDiscussion
            eventId={event.id}
            slug={event.slug}
            comments={event.comments}
            currentUserId={session?.user?.id}
            isStaff={isStaff}
            isLoggedIn={!!session?.user}
          />
        </div>
      </div>
    </Container>
  );
}

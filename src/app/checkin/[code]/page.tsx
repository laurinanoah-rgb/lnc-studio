import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { canManageEvent } from "@/lib/event-access";
import { checkInByCode } from "@/lib/checkin-actions";
import { LogoBadge } from "@/components/logo-badge";

export const metadata: Metadata = { title: "Check-in" };

export default async function CheckinScanPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await auth();

  const rsvp = await prisma.eventRsvp.findUnique({
    where: { checkInCode: code },
    include: { event: true, user: { select: { name: true } } },
  });

  if (!rsvp) notFound();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <LogoBadge />
        <p className="text-muted-foreground">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(`/checkin/${code}`)}`}
            className="text-accent hover:underline"
          >
            Melde dich an
          </Link>
          , um diese Person einzuchecken.
        </p>
      </div>
    );
  }

  const allowed = await canManageEvent(rsvp.event, session.user.id, session.user.role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <LogoBadge />
      <div>
        <h1 className="text-2xl font-semibold">{rsvp.user.name}</h1>
        <p className="mt-1 text-muted-foreground">{rsvp.event.title}</p>
      </div>

      {!allowed ? (
        <p className="text-sm text-red-400">Du darfst diese Person nicht einchecken.</p>
      ) : rsvp.checkedInAt ? (
        <p className="rounded-full bg-accent/20 px-6 py-3 text-sm font-medium text-accent">
          ✅ Bereits eingecheckt
        </p>
      ) : (
        <form action={checkInByCode.bind(null, code)}>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Jetzt einchecken
          </button>
        </form>
      )}

      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        Zur Startseite
      </Link>
    </div>
  );
}

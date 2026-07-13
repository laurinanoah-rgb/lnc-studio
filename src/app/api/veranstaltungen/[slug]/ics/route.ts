import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { buildIcsContent } from "@/lib/ics";
import { canViewEvent } from "@/lib/event-access";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event || !event.published) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const session = await auth();
  const allowed = await canViewEvent(event, session?.user?.id);
  if (!allowed) {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const url = new URL(request.url);
  const eventUrl = `${url.protocol}//${url.host}/veranstaltungen/${event.slug}`;

  const ics = buildIcsContent({
    uid: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    url: eventUrl,
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}

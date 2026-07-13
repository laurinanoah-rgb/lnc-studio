import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ModalTrigger } from "@/components/modal";
import { groupTagLabels } from "@/lib/group-tags";
import { formatDateTime } from "@/lib/format";
import { googleMapsDirectionsUrl } from "@/lib/maps";
import { EventCountdownBadge } from "@/components/event-countdown-badge";
import { joinGroup, leaveGroup, requestToJoin } from "../actions";
import { createGroupEvent, createGroupPoll, voteOnPoll, deleteGroupPoll } from "./actions";
import { GroupWall } from "./group-wall";
import { GroupEventForm } from "./group-event-form";
import { PollCreateForm } from "./poll-create-form";
import { PollOptionBar } from "./poll-option-bar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = await prisma.group.findUnique({ where: { slug } });
  return { title: group?.name ?? "Gruppe" };
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      _count: { select: { members: true } },
      events: {
        orderBy: { startDate: "asc" },
        where: { startDate: { gte: startOfToday } },
      },
    },
  });

  if (!group) notFound();

  const isOwner = session?.user?.id === group.ownerId;
  const membership = session?.user
    ? await prisma.groupMembership.findUnique({
        where: { userId_groupId: { userId: session.user.id, groupId: group.id } },
      })
    : null;
  const isMember = !!membership || isOwner;

  const myJoinRequest =
    session?.user && !isMember
      ? await prisma.groupJoinRequest.findUnique({
          where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
        })
      : null;

  const posts = isMember
    ? await prisma.groupPost.findMany({
        where: { groupId: group.id },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: { author: { select: { name: true } } },
          },
        },
      })
    : [];

  const polls = isMember
    ? await prisma.groupPoll.findMany({
        where: { groupId: group.id },
        orderBy: { createdAt: "desc" },
        include: {
          options: {
            orderBy: { order: "asc" },
            include: { votes: { select: { userId: true } } },
          },
        },
      })
    : [];

  const canCreateEvent = isOwner && group.tag === "PRIVATE_VERANSTALTUNG";
  const canCreatePoll = isOwner;

  return (
    <Container className="max-w-3xl py-16">
      <Link href="/gruppen" className="text-sm text-muted-foreground hover:text-foreground">
        ← Zurück zu Gruppen
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
        {group.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={group.coverImage} alt="" className="aspect-[3/1] w-full object-cover" />
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{group.name}</h1>
              <span className="mt-2 inline-block rounded-full bg-surface-hover px-3 py-1 text-xs text-muted-foreground">
                {groupTagLabels[group.tag]}
              </span>
              {group.locked && (
                <span className="ml-2 text-xs text-muted-foreground">🔒 Gesperrt</span>
              )}
              {group.public && (
                <span className="ml-2 text-xs text-muted-foreground">🌐 Öffentlich</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canCreatePoll && (
                <ModalTrigger label="Umfrage" icon="📊" title="Neue Umfrage" variant="outline">
                  <PollCreateForm action={createGroupPoll.bind(null, group.id, group.slug)} />
                </ModalTrigger>
              )}
              {canCreateEvent && (
                <ModalTrigger
                  label="Veranstaltung"
                  icon="🎉"
                  title="Veranstaltung erstellen"
                  variant="primary"
                >
                  <GroupEventForm
                    action={createGroupEvent.bind(null, group.id, group.slug)}
                    defaultPublic={group.public}
                  />
                </ModalTrigger>
              )}
              {isOwner && (
                <Link
                  href={`/gruppen/${group.slug}/einstellungen`}
                  aria-label="Gruppeneinstellungen"
                  title="Gruppeneinstellungen"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition-colors hover:bg-surface-hover"
                >
                  ⚙️
                </Link>
              )}
              {isMember && !isOwner && (
                <form action={leaveGroup.bind(null, group.id, group.slug)}>
                  <button
                    type="submit"
                    className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover"
                  >
                    Verlassen
                  </button>
                </form>
              )}
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{group.description}</p>
          <p className="mt-3 text-xs text-muted-foreground">{group._count.members} Mitglieder</p>

          {!isMember && session?.user && (
            <div className="mt-4">
              {group.locked ? (
                <form action={requestToJoin.bind(null, group.id, group.slug)}>
                  <button
                    type="submit"
                    disabled={myJoinRequest?.status === "PENDING"}
                    className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-50"
                  >
                    {myJoinRequest?.status === "PENDING" ? "Anfrage gesendet" : "Beitritt anfragen"}
                  </button>
                </form>
              ) : (
                <form action={joinGroup.bind(null, group.id, group.slug)}>
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
                  >
                    Beitreten
                  </button>
                </form>
              )}
            </div>
          )}
          {!isMember && !session?.user && (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/gruppen/${group.slug}`)}`}
                className="text-accent hover:underline"
              >
                Melde dich an
              </Link>
              , um beizutreten.
            </p>
          )}
        </div>
      </div>

      {isMember && group.events.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {group.events.map((event) => (
            <Card key={event.id} className="relative">
              <EventCountdownBadge startDate={event.startDate} />
              <p className="text-xs text-accent">{formatDateTime(event.startDate)}</p>
              <h3 className="mt-1 font-medium">📌 {event.title}</h3>
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
              <Link
                href={`/veranstaltungen/${event.slug}`}
                className="mt-3 inline-block text-sm text-accent hover:underline"
              >
                Details &amp; Zusagen →
              </Link>
            </Card>
          ))}
        </div>
      )}

      {isMember && polls.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
            const myOptionId = poll.options.find((option) =>
              option.votes.some((vote) => vote.userId === session?.user?.id),
            )?.id;

            return (
              <Card key={poll.id}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">📊 {poll.question}</h3>
                  {isOwner && (
                    <form action={deleteGroupPoll.bind(null, poll.id, group.id, group.slug)}>
                      <button type="submit" className="text-xs text-red-400 hover:underline">
                        Löschen
                      </button>
                    </form>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  {poll.options.map((option) => {
                    const count = option.votes.length;
                    const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    const isMine = option.id === myOptionId;

                    return (
                      <form
                        key={option.id}
                        action={voteOnPoll.bind(null, poll.id, option.id, group.id, group.slug)}
                      >
                        <button type="submit" className="w-full text-left">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isMine ? "font-medium text-accent" : undefined}>
                              {option.label} {isMine && "✓"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {count} · {percent}%
                            </span>
                          </div>
                          <PollOptionBar percent={percent} highlighted={isMine} />
                        </button>
                      </form>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {totalVotes} {totalVotes === 1 ? "Stimme" : "Stimmen"}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      {isMember ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Beiträge</h2>
          <div className="mt-4">
            <GroupWall groupId={group.id} slug={group.slug} posts={posts} />
          </div>
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Beiträge und weitere Inhalte sind nur für Mitglieder sichtbar.
        </p>
      )}
    </Container>
  );
}

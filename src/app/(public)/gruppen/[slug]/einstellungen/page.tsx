import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ImageUploadField } from "@/components/manager/image-upload-field";
import { groupTagOptions } from "@/lib/group-tags";
import { formatDate } from "@/lib/format";
import { UserBadge } from "@/components/user-badge";
import {
  updateGroupSettings,
  approveJoinRequest,
  denyJoinRequest,
  setMemberRole,
  removeMember,
} from "../actions";

export const metadata: Metadata = { title: "Gruppeneinstellungen" };

export default async function GroupSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const group = await prisma.group.findUnique({ where: { slug } });
  if (!group) notFound();
  if (session?.user?.id !== group.ownerId) {
    redirect(`/gruppen/${slug}`);
  }

  const [pendingRequests, members] = await Promise.all([
    prisma.groupJoinRequest.findMany({
      where: { groupId: group.id, status: "PENDING" },
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.groupMembership.findMany({
      where: { groupId: group.id },
      orderBy: { joinedAt: "asc" },
      include: { user: { select: { id: true, name: true, xp: true } } },
    }),
  ]);

  return (
    <Container className="max-w-2xl py-16">
      <Link
        href={`/gruppen/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Zurück zur Gruppe
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        ⚙️ Einstellungen · {group.name}
      </h1>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Grunddaten</h2>
        <form
          key={`${group.tag}-${group.locked}`}
          action={updateGroupSettings.bind(null, group.id, group.slug)}
          className="mt-4 flex flex-col gap-4"
        >
          <div>
            <label htmlFor="name" className="text-sm text-muted-foreground">
              Gruppenname
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={group.name}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm text-muted-foreground">
              Beschreibung
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={group.description}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <ImageUploadField
            name="coverImage"
            label="Gruppenbild"
            defaultValue={group.coverImage}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="tag" className="text-sm text-muted-foreground">
                Um was geht es in der Gruppe?
              </label>
              <select
                id="tag"
                name="tag"
                defaultValue={group.tag}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                {groupTagOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="locked"
                defaultChecked={group.locked}
                className="h-4 w-4 rounded border-border"
              />
              Gesperrt (Beitritt nur mit Erlaubnis)
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Hinweis: Ob die Gruppe öffentlich ist (Events auch auf /veranstaltungen sichtbar),
            legst du beim Erstellen einer Veranstaltung fest.
          </p>
          <button
            type="submit"
            className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Speichern
          </button>
        </form>
      </Card>

      {pendingRequests.length > 0 && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold">Beitrittsanfragen</h2>
          <div className="mt-4 flex flex-col gap-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>{request.user.name}</span>
                <div className="flex gap-2">
                  <form action={approveJoinRequest.bind(null, request.id, group.id, group.slug)}>
                    <button
                      type="submit"
                      className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground transition-colors hover:bg-accent-strong"
                    >
                      Annehmen
                    </button>
                  </form>
                  <form action={denyJoinRequest.bind(null, request.id, group.id, group.slug)}>
                    <button
                      type="submit"
                      className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-surface-hover"
                    >
                      Ablehnen
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Mitglieder ({members.length})</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Moderator:innen können Beitrittsanfragen annehmen oder ablehnen.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {members.map((member) => {
            const isThisOwner = member.userId === group.ownerId;
            return (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div>
                  <span>
                    <UserBadge name={member.user.name} xp={member.user.xp} />
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    seit {formatDate(member.joinedAt)}
                  </span>
                </div>
                {isThisOwner ? (
                  <span className="rounded-full bg-surface-hover px-3 py-1 text-xs text-muted-foreground">
                    👑 Inhaber:in
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <form
                      action={setMemberRole.bind(
                        null,
                        group.id,
                        member.userId,
                        group.slug,
                        member.role === "MODERATOR" ? "MEMBER" : "MODERATOR",
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-surface-hover"
                      >
                        {member.role === "MODERATOR" ? "Moderator:in ✓" : "Zu Moderator:in machen"}
                      </button>
                    </form>
                    <form action={removeMember.bind(null, group.id, member.userId, group.slug)}>
                      <button
                        type="submit"
                        className="rounded-full border border-border px-3 py-1 text-xs text-red-400 transition-colors hover:bg-surface-hover"
                      >
                        Entfernen
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </Container>
  );
}

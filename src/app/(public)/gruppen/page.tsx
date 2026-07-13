import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { joinGroup, requestToJoin } from "./actions";
import { groupTagLabels } from "@/lib/group-tags";

export const metadata: Metadata = { title: "Gruppen" };

export default async function GruppenPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "__no_user__";

  const groups = await prisma.group.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      members: { where: { userId } },
      joinRequests: { where: { userId, status: "PENDING" } },
      _count: { select: { members: true } },
    },
  });

  return (
    <Container className="py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            👨‍👨‍👦‍👦 Gruppen
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Finde deine Leute in der Community.
          </p>
        </div>
        {session?.user && <LinkButton href="/gruppen/neu">+ Neue Gruppe</LinkButton>}
      </div>

      {!session?.user && (
        <p className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
          <Link href="/login" className="text-accent hover:underline">
            Melde dich an
          </Link>{" "}
          oder{" "}
          <Link href="/registrieren" className="text-accent hover:underline">
            registriere dich
          </Link>
          , um Gruppen beizutreten oder eigene zu erstellen.
        </p>
      )}

      {groups.length === 0 ? (
        <p className="mt-12 text-muted-foreground">Noch keine Gruppen vorhanden.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const isMember = group.members.length > 0;
            const hasPendingRequest = group.joinRequests.length > 0;

            return (
              <Card key={group.id}>
                {group.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={group.coverImage}
                    alt=""
                    className="-mx-6 -mt-6 mb-4 aspect-video rounded-t-2xl object-cover"
                  />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{group.name}</h2>
                  {group.locked && <span className="shrink-0 text-xs text-muted-foreground">🔒</span>}
                </div>
                <span className="mt-1 inline-block rounded-full bg-surface-hover px-3 py-1 text-xs text-muted-foreground">
                  {groupTagLabels[group.tag]}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">{group.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {group._count.members} Mitglieder
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {isMember ? (
                    <Link
                      href={`/gruppen/${group.slug}`}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
                    >
                      Zur Gruppe
                    </Link>
                  ) : session?.user ? (
                    group.locked ? (
                      <form action={requestToJoin.bind(null, group.id, group.slug)}>
                        <button
                          type="submit"
                          disabled={hasPendingRequest}
                          className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover disabled:opacity-50"
                        >
                          {hasPendingRequest ? "Anfrage gesendet" : "Beitritt anfragen"}
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
                    )
                  ) : (
                    <Link
                      href="/login"
                      className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover"
                    >
                      Login zum Beitreten
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}

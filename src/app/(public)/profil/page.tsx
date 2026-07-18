import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { LevelBar } from "@/components/level-bar";
import { computeBadges } from "@/lib/leveling";

export const metadata: Metadata = { title: "Übersicht" };

export default async function ProfilUebersichtPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profil");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const [checkedInEvents, pollVotes, groupPosts] = await Promise.all([
    prisma.eventRsvp.count({ where: { userId: user.id, checkedInAt: { not: null } } }),
    prisma.groupPollVote.count({ where: { userId: user.id } }),
    prisma.groupPost.count({ where: { authorId: user.id } }),
  ]);

  const badges = computeBadges({ checkedInEvents, pollVotes, groupPosts, xp: user.xp });

  return (
    <Card>
      <h2 className="text-lg font-semibold">Fortschritt</h2>
      <div className="mt-4">
        <LevelBar xp={user.xp} />
      </div>
      {badges.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-hover px-3 py-1.5 text-xs font-medium"
            >
              <span>{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Noch keine Abzeichen — nimm an Events teil, stimme in Umfragen ab oder schreib Beiträge
          in Gruppen, um welche zu sammeln.
        </p>
      )}
    </Card>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/format";
import { getLevel } from "@/lib/leveling";

export const metadata: Metadata = { title: "Mitglieder" };

const roleLabels: Record<string, string> = {
  MANAGER: "Manager",
  TEAM: "Team",
  MITGLIED: "Mitglied",
};

export default async function MitgliederPage() {
  const members = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    select: {
      id: true,
      name: true,
      role: true,
      createdAt: true,
      avatarUrl: true,
      xp: true,
      discordHandle: true,
      instagramUrl: true,
      tiktokUrl: true,
      youtubeUrl: true,
    },
  });

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">👥 Mitglieder</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        {members.length} Mitglieder sind schon dabei.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="flex items-center gap-4">
            {member.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatarUrl}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gradient-red),var(--gradient-orange),var(--gradient-blue))] text-sm font-semibold text-white">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{member.name}</p>
                <span className="shrink-0 rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Lvl {getLevel(member.xp)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {roleLabels[member.role] ?? member.role} · seit {formatDate(member.createdAt)}
              </p>
              {(member.discordHandle || member.instagramUrl || member.tiktokUrl || member.youtubeUrl) && (
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {member.discordHandle && <span>💬 {member.discordHandle}</span>}
                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      📸
                    </a>
                  )}
                  {member.tiktokUrl && (
                    <a
                      href={member.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      🎵
                    </a>
                  )}
                  {member.youtubeUrl && (
                    <a
                      href={member.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      ▶️
                    </a>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
        {members.length === 0 && (
          <p className="text-muted-foreground">Noch keine Mitglieder registriert.</p>
        )}
      </div>
    </Container>
  );
}

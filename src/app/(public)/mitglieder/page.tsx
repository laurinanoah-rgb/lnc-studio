import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Mitglieder" };

const roleLabels: Record<string, string> = {
  MANAGER: "Manager",
  TEAM: "Team",
  MITGLIED: "Mitglied",
};

export default async function MitgliederPage() {
  const members = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, role: true, createdAt: true },
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gradient-red),var(--gradient-orange),var(--gradient-blue))] text-sm font-semibold text-white">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">
                {roleLabels[member.role] ?? member.role} · seit {formatDate(member.createdAt)}
              </p>
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

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/manager/delete-button";
import { createGroup, updateGroup, deleteGroup } from "./actions";
import { GroupFields } from "./group-fields";

export const metadata: Metadata = { title: "Gruppen" };

export default async function ManagerGroupsPage() {
  const groups = await prisma.group.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Gruppen</h1>
      <p className="mt-1 text-sm text-muted-foreground">Community-Gruppen verwalten.</p>

      <Card className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold">Neue Gruppe</h2>
        <GroupFields action={createGroup} submitLabel="Gruppe anlegen" />
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.id}>
            <p className="text-xs text-muted-foreground">{group._count.members} Mitglieder</p>
            <GroupFields
              action={updateGroup.bind(null, group.id)}
              group={group}
              submitLabel="Speichern"
            />
            <div className="mt-3 flex justify-end">
              <DeleteButton action={deleteGroup.bind(null, group.id)} />
            </div>
          </Card>
        ))}
        {groups.length === 0 && (
          <p className="text-muted-foreground">Noch keine Gruppen vorhanden.</p>
        )}
      </div>
    </div>
  );
}

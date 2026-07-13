import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/manager/delete-button";
import { createProject, updateProject, deleteProject } from "./actions";
import { ProjectFields } from "./project-fields";

export const metadata: Metadata = { title: "Projekte" };

export default async function ManagerProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Projekte</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Community-Projekte wie Minecraft-Server &amp; Discord pflegen.
      </p>

      <Card className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold">Neues Projekt</h2>
        <ProjectFields action={createProject} submitLabel="Projekt anlegen" />
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <ProjectFields
              action={updateProject.bind(null, project.id)}
              project={project}
              submitLabel="Speichern"
            />
            <div className="mt-3 flex justify-end">
              <DeleteButton action={deleteProject.bind(null, project.id)} />
            </div>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground">Noch keine Projekte vorhanden.</p>
        )}
      </div>
    </div>
  );
}

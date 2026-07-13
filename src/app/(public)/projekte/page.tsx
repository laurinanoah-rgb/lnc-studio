import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Projekte" };

export default async function ProjektePage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">🧮 Projekte</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Unsere Community-Projekte im Überblick.
      </p>

      {projects.length === 0 ? (
        <p className="mt-12 text-muted-foreground">Aktuell keine Projekte hinterlegt.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <div className="flex items-start gap-4">
                {project.icon && <span className="text-3xl">{project.icon}</span>}
                <div>
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                  {project.linkUrl && (
                    <a
                      href={project.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
                    >
                      {project.linkLabel || "Mehr erfahren"}
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

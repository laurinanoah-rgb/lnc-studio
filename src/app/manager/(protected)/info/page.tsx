import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { updateSiteContent } from "./actions";

export const metadata: Metadata = { title: "Info-Seite" };

export default async function ManagerInfoPage() {
  const content = await prisma.siteContent.upsert({
    where: { key: "info" },
    update: {},
    create: { key: "info", title: "Unsere Geschichte", body: "" },
  });

  const action = updateSiteContent.bind(null, "info");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Info-Seite</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Inhalt der öffentlichen /info-Seite bearbeiten.
      </p>

      <Card className="mt-8 max-w-2xl">
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="text-sm text-muted-foreground">
              Titel
            </label>
            <input
              id="title"
              name="title"
              defaultValue={content.title}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="body" className="text-sm text-muted-foreground">
              Text
            </label>
            <textarea
              id="body"
              name="body"
              rows={10}
              defaultValue={content.body}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Speichern
          </button>
        </form>
      </Card>
    </div>
  );
}

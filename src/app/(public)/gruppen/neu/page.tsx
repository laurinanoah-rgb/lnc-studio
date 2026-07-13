import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { ImageUploadField } from "@/components/manager/image-upload-field";
import { createGroup } from "../actions";

export const metadata: Metadata = { title: "Neue Gruppe" };

export default async function NewGroupPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/gruppen/neu");
  }

  return (
    <Container className="max-w-lg py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Neue Gruppe erstellen</h1>
      <p className="mt-2 text-muted-foreground">
        Du wirst automatisch Inhaber:in dieser Gruppe.
      </p>
      <form action={createGroup} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-sm text-muted-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
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
            rows={4}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <ImageUploadField name="coverImage" label="Gruppenbild" />
        <button
          type="submit"
          className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          Gruppe erstellen
        </button>
      </form>
    </Container>
  );
}

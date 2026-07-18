import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { changeEmail, changePassword } from "../actions";

export const metadata: Metadata = { title: "Sicherheit" };

export default async function SicherheitPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profil/sicherheit");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-lg font-semibold">E-Mail-Adresse</h2>
        <form action={changeEmail} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user.email}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Ändern
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Passwort ändern</h2>
        <form action={changePassword} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="currentPassword" className="text-sm text-muted-foreground">
              Aktuelles Passwort
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm text-muted-foreground">
              Neues Passwort
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Passwort ändern
          </button>
        </form>
      </Card>
    </div>
  );
}

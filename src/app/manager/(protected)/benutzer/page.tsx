import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/manager/delete-button";
import { createUser, deleteUser } from "./actions";

export const metadata: Metadata = { title: "Benutzer" };

export default async function ManagerUsersPage() {
  const session = await auth();
  if (session?.user.role !== "MANAGER") {
    redirect("/manager");
  }

  const users = await prisma.user.findMany({
    where: { role: { in: ["MANAGER", "TEAM"] } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Benutzer</h1>
      <p className="mt-1 text-sm text-muted-foreground">Team- und Manager-Konten verwalten.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">E-Mail</th>
                <th className="px-4 py-3 font-medium">Rolle</th>
                <th className="px-4 py-3 text-right font-medium">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-surface-hover px-3 py-1 text-xs">
                      {user.role === "MANAGER" ? "Manager" : "Team"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.id === session.user.id ? (
                      <span className="text-xs text-muted-foreground">Aktueller Benutzer</span>
                    ) : (
                      <DeleteButton
                        action={deleteUser.bind(null, user.id)}
                        confirmText={`${user.name} wirklich löschen?`}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card>
          <h2 className="text-lg font-semibold">Neuen Benutzer anlegen</h2>
          <form action={createUser} className="mt-4 flex flex-col gap-4">
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
              <label htmlFor="email" className="text-sm text-muted-foreground">
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm text-muted-foreground">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="role" className="text-sm text-muted-foreground">
                Rolle
              </label>
              <select
                id="role"
                name="role"
                defaultValue="TEAM"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="TEAM">Team</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
            >
              Benutzer anlegen
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

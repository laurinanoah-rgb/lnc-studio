import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ImageUploadField } from "@/components/manager/image-upload-field";
import { LevelBar } from "@/components/level-bar";
import { computeBadges } from "@/lib/leveling";
import { updateProfile, changeEmail, changePassword } from "./actions";

export const metadata: Metadata = { title: "Mein Profil" };

export default async function ProfilPage() {
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
    <Container className="max-w-2xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">👤 Mein Profil</h1>
      <p className="mt-2 text-muted-foreground">
        Verwalte deine Kontodaten, dein Profilbild und deine Verknüpfungen.
      </p>

      <Card className="mt-8">
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
            Noch keine Abzeichen — nimm an Events teil, stimme in Umfragen ab oder schreib
            Beiträge in Gruppen, um welche zu sammeln.
          </p>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Profil</h2>
        <form action={updateProfile} className="mt-4 flex flex-col gap-4">
          <ImageUploadField name="avatarUrl" label="Profilbild" defaultValue={user.avatarUrl} />
          <div>
            <label htmlFor="name" className="text-sm text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={user.name}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="mt-2 border-t border-border pt-4">
            <p className="text-sm font-medium">Soziale Netzwerke</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="discordHandle" className="text-sm text-muted-foreground">
                  💬 Discord
                </label>
                <input
                  id="discordHandle"
                  name="discordHandle"
                  placeholder="Benutzername"
                  defaultValue={user.discordHandle ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="instagramUrl" className="text-sm text-muted-foreground">
                  📸 Instagram
                </label>
                <input
                  id="instagramUrl"
                  name="instagramUrl"
                  placeholder="https://instagram.com/…"
                  defaultValue={user.instagramUrl ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="tiktokUrl" className="text-sm text-muted-foreground">
                  🎵 TikTok
                </label>
                <input
                  id="tiktokUrl"
                  name="tiktokUrl"
                  placeholder="https://tiktok.com/@…"
                  defaultValue={user.tiktokUrl ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="youtubeUrl" className="text-sm text-muted-foreground">
                  ▶️ YouTube
                </label>
                <input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  placeholder="https://youtube.com/@…"
                  defaultValue={user.youtubeUrl ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Speichern
          </button>
        </form>
      </Card>

      <Card className="mt-6">
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

      <Card className="mt-6">
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
    </Container>
  );
}

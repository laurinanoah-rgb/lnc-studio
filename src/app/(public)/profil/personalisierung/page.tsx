import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ImageUploadField } from "@/components/manager/image-upload-field";
import { getLevel } from "@/lib/leveling";
import { updateProfile, toggleNeonMode } from "../actions";
import { SocialLinkField } from "../social-link-field";
import { NeonModeToggle } from "./neon-mode-toggle";

export const metadata: Metadata = { title: "Personalisierung" };

export default async function PersonalisierungPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profil/personalisierung");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const canUseNeonMode = getLevel(user.xp) >= 10;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-lg font-semibold">Profil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vervollständige Profilbild und Bio für einen einmaligen +50-XP-Bonus.
        </p>
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
          <div>
            <label htmlFor="bio" className="text-sm text-muted-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Erzähl uns kurz etwas über dich…"
              defaultValue={user.bio ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Speichern
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Soziale Netzwerke</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verknüpfe deine Profile, damit andere Mitglieder dich finden können.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <SocialLinkField
            icon="💬"
            label="Discord"
            field="discordHandle"
            value={user.discordHandle}
            placeholder="Benutzername"
          />
          <SocialLinkField
            icon="📸"
            label="Instagram"
            field="instagramUrl"
            value={user.instagramUrl}
            placeholder="https://instagram.com/…"
          />
          <SocialLinkField
            icon="🎵"
            label="TikTok"
            field="tiktokUrl"
            value={user.tiktokUrl}
            placeholder="https://tiktok.com/@…"
          />
          <SocialLinkField
            icon="▶️"
            label="YouTube"
            field="youtubeUrl"
            value={user.youtubeUrl}
            placeholder="https://youtube.com/@…"
          />
        </div>
      </Card>

      {canUseNeonMode && (
        <Card>
          <h2 className="text-lg font-semibold">🎨 LNC Neon Mode</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ab Level 10 freigeschaltet — schaltet ein alternatives Farbschema für die ganze Seite
            um, nur für dich sichtbar.
          </p>
          <div className="mt-4">
            <NeonModeToggle enabled={user.neonModeEnabled} action={toggleNeonMode} />
          </div>
        </Card>
      )}
    </div>
  );
}

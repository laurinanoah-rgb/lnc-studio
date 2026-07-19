import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { ProfilSidebar, ProfilMobileNav } from "@/components/profil-sidebar";

const NEU_BADGE_DURATION_MS = 48 * 60 * 60 * 1000;

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profil");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { level10UnlockedAt: true },
  });

  const showNeuBadge = !!(
    user?.level10UnlockedAt &&
    Date.now() - user.level10UnlockedAt.getTime() < NEU_BADGE_DURATION_MS
  );

  return (
    <Container className="max-w-4xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">👤 Mein Profil</h1>
      <p className="mt-2 text-muted-foreground">
        Verwalte deine Kontodaten, dein Profilbild und deine Verknüpfungen.
      </p>

      <div className="mt-8">
        <ProfilMobileNav showNeuBadge={showNeuBadge} />
      </div>

      <div className="mt-2 flex gap-8 md:mt-8">
        <ProfilSidebar showNeuBadge={showNeuBadge} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}

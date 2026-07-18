import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { ProfilSidebar, ProfilMobileNav } from "@/components/profil-sidebar";

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profil");

  return (
    <Container className="max-w-4xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">👤 Mein Profil</h1>
      <p className="mt-2 text-muted-foreground">
        Verwalte deine Kontodaten, dein Profilbild und deine Verknüpfungen.
      </p>

      <div className="mt-8">
        <ProfilMobileNav />
      </div>

      <div className="mt-2 flex gap-8 md:mt-8">
        <ProfilSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}

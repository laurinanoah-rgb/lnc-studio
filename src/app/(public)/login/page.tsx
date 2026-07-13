import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { LogoBadge } from "@/components/logo-badge";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <Link href="/" className="inline-block">
          <LogoBadge />
        </Link>
        <h1 className="mt-4 text-xl font-semibold">Anmelden</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Willkommen zurück bei der LaurinaNoahCommunity.
        </p>
        <div className="mt-6">
          <LoginForm callbackUrl={params.callbackUrl ?? "/"} />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Noch kein Konto?{" "}
          <Link href="/registrieren" className="text-accent hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}

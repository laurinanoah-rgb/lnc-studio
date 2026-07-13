import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "./register-form";
import { LogoBadge } from "@/components/logo-badge";

export const metadata: Metadata = { title: "Registrieren" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <Link href="/" className="inline-block">
          <LogoBadge />
        </Link>
        <h1 className="mt-4 text-xl font-semibold">Werde Teil der Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registriere dich und tritt Gruppen bei.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Bereits ein Konto?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}

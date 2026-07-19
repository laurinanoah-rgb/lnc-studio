import Link from "next/link";
import { LogoBadge } from "@/components/logo-badge";
import { EasterEggTrigger } from "@/components/easter-egg-trigger";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <LogoBadge />
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaurinaNoahCommunity. Alle Rechte vorbehalten.
            <EasterEggTrigger />
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/info" className="hover:text-foreground">
            Info
          </Link>
          <Link href="/updates" className="hover:text-foreground">
            Updates
          </Link>
          <Link href="/veranstaltungen" className="hover:text-foreground">
            Veranstaltungen
          </Link>
          <Link href="/galerie" className="hover:text-foreground">
            Galerie
          </Link>
          <Link href="/projekte" className="hover:text-foreground">
            Projekte
          </Link>
          <Link href="/gruppen" className="hover:text-foreground">
            Gruppen
          </Link>
          <Link href="/faq" className="hover:text-foreground">
            FAQ
          </Link>
          <Link href="/mitglieder" className="hover:text-foreground">
            Mitglieder
          </Link>
          <Link href="/anfrage" className="hover:text-foreground">
            Anfrage
          </Link>
          <Link href="/impressum" className="hover:text-foreground">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}

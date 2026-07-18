import Link from "next/link";
import { auth } from "@/auth";
import { MobileNav } from "@/components/mobile-nav";
import { LogoBadge } from "@/components/logo-badge";
import { logoutAction } from "@/lib/auth-actions";

const navLinks = [
  { href: "/info", label: "Info", emoji: "ℹ️" },
  { href: "/updates", label: "Updates", emoji: "📰" },
  { href: "/veranstaltungen", label: "Events", emoji: "🎉" },
  { href: "/galerie", label: "Galerie", emoji: "📸" },
  { href: "/projekte", label: "Projekte", emoji: "🧮" },
  { href: "/gruppen", label: "Gruppen", emoji: "👨‍👨‍👦‍👦" },
  { href: "/faq", label: "FAQ", emoji: "📚" },
  { href: "/mitglieder", label: "Members", emoji: "👥" },
];

export async function SiteHeader() {
  const session = await auth();
  const isStaff = session?.user?.role === "MANAGER" || session?.user?.role === "TEAM";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoBadge />
        </Link>

        <nav className="hidden items-center gap-1 overflow-x-auto lg:flex xl:gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className="flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <span className="text-lg leading-none">{link.emoji}</span>
              <span className="text-[10px] font-medium leading-none whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={session?.user ? (isStaff ? "/manager" : "/profil") : "/login"}
            className="whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-hover"
          >
            {session?.user ? (isStaff ? "⚙️ Manager" : "👤 Mein Bereich") : "🔑 Login"}
          </Link>
          <Link
            href="/anfrage"
            className="whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            🔊 Anfrage
          </Link>
          {session?.user && (
            <form action={logoutAction}>
              <button
                type="submit"
                className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Abmelden
              </button>
            </form>
          )}
        </div>

        <MobileNav links={navLinks} isLoggedIn={!!session?.user} isStaff={isStaff} />
      </div>
    </header>
  );
}

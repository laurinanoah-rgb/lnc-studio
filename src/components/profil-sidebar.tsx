"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/profil", label: "📊 Übersicht", exact: true },
  { href: "/profil/personalisierung", label: "🎨 Personalisierung" },
  { href: "/profil/sicherheit", label: "🔒 Sicherheit" },
];

export function ProfilSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-24 flex flex-col gap-1">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function ProfilMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 md:hidden">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
              active
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/next-auth";
import { LogoBadge } from "@/components/logo-badge";

const links = [
  { href: "/manager", label: "Dashboard", exact: true },
  { href: "/manager/updates", label: "Updates" },
  { href: "/manager/veranstaltungen", label: "Veranstaltungen" },
  { href: "/manager/galerie", label: "Galerie" },
  { href: "/manager/anfragen", label: "Anfragen" },
  { href: "/manager/projekte", label: "Projekte" },
  { href: "/manager/gruppen", label: "Gruppen" },
  { href: "/manager/faq", label: "FAQ" },
  { href: "/manager/info", label: "Info-Seite" },
];

export function ManagerSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const allLinks =
    role === "MANAGER"
      ? [...links, { href: "/manager/benutzer", label: "Benutzer" }]
      : links;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="border-b border-border p-6">
        <Link href="/" className="inline-block">
          <LogoBadge />
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Manager-Bereich</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {allLinks.map((link) => {
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

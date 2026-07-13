"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/next-auth";

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

export function ManagerMobileNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const allLinks =
    role === "MANAGER"
      ? [...links, { href: "/manager/benutzer", label: "Benutzer" }]
      : links;

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border bg-surface px-4 py-3 md:hidden">
      {allLinks.map((link) => {
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

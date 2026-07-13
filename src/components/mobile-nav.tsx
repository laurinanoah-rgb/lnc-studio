"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/auth-actions";

type NavLink = { href: string; label: string; emoji: string };

export function MobileNav({
  links,
  isLoggedIn,
  isStaff,
}: {
  links: NavLink[];
  isLoggedIn: boolean;
  isStaff: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l14 14M15 1L1 15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 3h14M1 8h14M1 13h14" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-30 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background px-4 pb-6 pt-2 sm:px-6">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface-hover"
              >
                <span className="text-xl leading-none">{link.emoji}</span>
                {link.label}
              </Link>
            ))}
            <Link
              href="/anfrage"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-accent hover:bg-surface-hover"
            >
              Anfrage stellen
            </Link>
            <Link
              href={isLoggedIn ? (isStaff ? "/manager" : "/gruppen") : "/login"}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-surface-hover"
            >
              {isLoggedIn ? (isStaff ? "Manager-Bereich" : "Mein Bereich") : "Login"}
            </Link>
            {isLoggedIn && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-lg px-3 py-3 text-left text-base text-muted-foreground hover:bg-surface-hover"
                >
                  Abmelden
                </button>
              </form>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

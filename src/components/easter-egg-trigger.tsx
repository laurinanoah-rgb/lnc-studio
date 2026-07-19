"use client";

import { useTransition } from "react";
import { claimEasterEgg } from "@/app/(public)/profil/actions";

export function EasterEggTrigger() {
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => startTransition(() => claimEasterEgg())}
      className="h-2 w-2 shrink-0 rounded-full bg-transparent outline-none"
      style={{ cursor: "default" }}
    />
  );
}

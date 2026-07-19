"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export function NeonModeToggle({
  enabled,
  action,
}: {
  enabled: boolean;
  action: (enabled: boolean) => Promise<void>;
}) {
  const [isOn, setIsOn] = useState(enabled);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !isOn;
    setIsOn(next);
    startTransition(async () => {
      await action(next);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={toggle}
      className={cn(
        "flex items-center gap-3 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60",
        isOn ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-surface-hover",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
          isOn ? "bg-accent-foreground/30" : "bg-surface-hover",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white transition-transform",
            isOn ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
      {isOn ? "Neon Mode aktiv" : "Neon Mode aktivieren"}
    </button>
  );
}

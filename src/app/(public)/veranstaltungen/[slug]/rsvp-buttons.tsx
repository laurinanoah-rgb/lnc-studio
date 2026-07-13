"use client";

import { useTransition } from "react";
import type { RsvpStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { setRsvp } from "./actions";

export function RsvpButtons({
  eventId,
  slug,
  currentStatus,
}: {
  eventId: string;
  slug: string;
  currentStatus: RsvpStatus | null;
}) {
  const [isPending, startTransition] = useTransition();

  function respond(status: RsvpStatus) {
    startTransition(async () => {
      await setRsvp(eventId, slug, status);
    });
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => respond("ZUSAGE")}
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
          currentStatus === "ZUSAGE"
            ? "bg-accent text-accent-foreground"
            : "border border-border text-foreground hover:bg-surface-hover",
        )}
      >
        Ich komme
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => respond("ABSAGE")}
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
          currentStatus === "ABSAGE"
            ? "bg-surface-hover text-foreground"
            : "border border-border text-muted-foreground hover:bg-surface-hover",
        )}
      >
        Absagen
      </button>
    </div>
  );
}

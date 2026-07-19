"use client";

import { useState } from "react";
import type { InquiryStatus } from "@prisma/client";

export function StatusDecision({
  status,
  onApprove,
  onReject,
}: {
  status: InquiryStatus;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [showButtons, setShowButtons] = useState(status === "NEU");

  if (!showButtons) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={
            status === "GENEHMIGT"
              ? "rounded-full bg-green-500/15 px-3 py-1.5 text-sm font-medium text-green-400"
              : "rounded-full bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-400"
          }
        >
          {status === "GENEHMIGT" ? "Genehmigt ✓" : "Abgelehnt ✗"}
        </span>
        <button
          type="button"
          onClick={() => setShowButtons(true)}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Entscheidung ändern
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <form action={onApprove}>
        <button
          type="submit"
          className="rounded-full bg-green-500/15 px-3 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/25"
        >
          ✅ Genehmigen
        </button>
      </form>
      <form action={onReject}>
        <button
          type="submit"
          className="rounded-full bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/25"
        >
          ❌ Ablehnen
        </button>
      </form>
    </div>
  );
}

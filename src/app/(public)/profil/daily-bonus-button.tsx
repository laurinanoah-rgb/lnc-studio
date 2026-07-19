"use client";

import { useState, useTransition } from "react";
import { claimDailyBonus } from "./actions";

export function DailyBonusButton({ alreadyClaimedToday }: { alreadyClaimedToday: boolean }) {
  const [claimed, setClaimed] = useState(alreadyClaimedToday);
  const [isPending, startTransition] = useTransition();

  function claim() {
    startTransition(async () => {
      await claimDailyBonus();
      setClaimed(true);
    });
  }

  return (
    <button
      type="button"
      disabled={claimed || isPending}
      onClick={claim}
      className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
    >
      {claimed ? "✅ Heute schon abgeholt — komm morgen wieder" : "🎁 Tages-Bonus abholen"}
    </button>
  );
}

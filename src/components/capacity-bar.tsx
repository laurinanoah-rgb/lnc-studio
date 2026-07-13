"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CapacityBar({ current, capacity }: { current: number; capacity: number }) {
  const ratio = capacity > 0 ? Math.min(current / capacity, 1) : 0;
  const percent = Math.round(ratio * 100);
  const full = current >= capacity;

  const barColor = full
    ? "bg-[var(--danger)]"
    : ratio >= 0.7
      ? "bg-[var(--warning)]"
      : "bg-[var(--success)]";

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {current} / {capacity} Plätze
        </span>
        <span className={full ? "font-medium text-[var(--danger)]" : undefined}>
          {full ? "Ausverkauft 🔥" : `${percent}%`}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-hover">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", barColor)}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

export function CountdownTimer({
  target,
  compact = false,
}: {
  target: Date | string;
  compact?: boolean;
}) {
  const targetDate = typeof target === "string" ? new Date(target) : target;
  const [parts, setParts] = useState<ReturnType<typeof getTimeParts> | null>(null);

  useEffect(() => {
    setParts(getTimeParts(targetDate));
    const interval = setInterval(() => setParts(getTimeParts(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Tage", value: parts?.days ?? 0 },
    { label: "Std", value: parts?.hours ?? 0 },
    { label: "Min", value: parts?.minutes ?? 0 },
    { label: "Sek", value: parts?.seconds ?? 0 },
  ];

  if (parts?.done) {
    return <span className="text-sm font-medium text-accent">Es geht los! 🎉</span>;
  }

  return (
    <div className={compact ? "flex items-center gap-2" : "flex items-center gap-3 sm:gap-4"}>
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span
            className={
              compact
                ? "text-lg font-bold tabular-nums text-foreground"
                : "text-3xl font-bold tabular-nums text-foreground sm:text-4xl"
            }
          >
            {parts ? String(unit.value).padStart(2, "0") : "--"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

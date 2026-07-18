"use client";

import { motion } from "framer-motion";
import { getLevel, xpIntoLevel } from "@/lib/leveling";

export function LevelBar({ xp }: { xp: number }) {
  const level = getLevel(xp);
  const into = xpIntoLevel(xp);
  const percent = into;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Level {level}</span>
        <span className="text-xs text-muted-foreground">
          {into} / 100 XP bis Level {level + 1}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-hover">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--gradient-red),var(--gradient-orange),var(--gradient-blue))]"
        />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PollOptionBar({ percent, highlighted }: { percent: number; highlighted?: boolean }) {
  return (
    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-hover">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full",
          highlighted
            ? "bg-accent"
            : "bg-[linear-gradient(90deg,var(--gradient-red),var(--gradient-orange),var(--gradient-blue))]",
        )}
      />
    </div>
  );
}

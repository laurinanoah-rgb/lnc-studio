"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Disclosure({
  label,
  closeLabel = "Abbrechen",
  children,
  variant = "primary",
  defaultOpen = false,
}: {
  label: string;
  closeLabel?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
          variant === "primary"
            ? "bg-accent text-accent-foreground hover:bg-accent-strong"
            : "border border-border text-foreground hover:bg-surface-hover",
        )}
      >
        {open ? closeLabel : label}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

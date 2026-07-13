"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ShareButton({
  title,
  url,
  className,
  variant = "light",
}: {
  title: string;
  url: string;
  className?: string;
  variant?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Teilen-Dialog wurde vom Nutzer abgebrochen.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  const buttonClass = cn(
    "rounded-full border px-4 py-2 text-sm transition-colors",
    variant === "dark"
      ? "border-white/30 text-white hover:bg-white/10"
      : "border-border text-foreground hover:bg-surface-hover",
    className,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={handleShare} className={buttonClass}>
        {copied ? "Link kopiert" : "Teilen"}
      </button>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        WhatsApp
      </a>
    </div>
  );
}

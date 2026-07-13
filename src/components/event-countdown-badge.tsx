import { cn } from "@/lib/utils";

export function EventCountdownBadge({ startDate }: { startDate: Date }) {
  const diffMs = startDate.getTime() - Date.now();
  if (diffMs < 0) return null;

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isSoon = diffDays <= 7;
  const label = diffDays === 0 ? "Heute!" : diffDays === 1 ? "Morgen" : `in ${diffDays} Tagen`;

  return (
    <span
      className={cn(
        "absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium backdrop-blur",
        isSoon ? "bg-accent text-accent-foreground" : "bg-black/50 text-white",
      )}
    >
      {isSoon && <span className="animate-bounce">🔔</span>}
      {label}
    </span>
  );
}

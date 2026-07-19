import { getLevel } from "@/lib/leveling";
import { cn } from "@/lib/utils";

export function UserBadge({
  name,
  xp,
  className,
}: {
  name: string;
  xp: number;
  className?: string;
}) {
  const level = getLevel(xp);

  const tierClass =
    level >= 15
      ? "text-gradient font-semibold"
      : level >= 10
        ? "text-glow font-medium"
        : level >= 5
          ? "font-medium"
          : undefined;

  const style = level >= 5 && level < 10 ? { color: "var(--gradient-blue)" } : undefined;

  return (
    <span className={cn(tierClass, className)} style={style}>
      {name}
    </span>
  );
}

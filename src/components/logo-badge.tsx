import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoBadge({ className }: { className?: string }) {
  return (
    <Image
      src="/branding/logo.png"
      alt="LNC Community"
      width={56}
      height={56}
      priority
      className={cn("h-12 w-12 rounded-xl object-cover animate-logo-sway", className)}
    />
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "gradient";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-strong",
  outline: "border border-border text-foreground hover:bg-surface-hover",
  ghost: "text-foreground hover:bg-surface-hover",
  gradient:
    "text-white bg-[linear-gradient(90deg,var(--gradient-red),var(--gradient-orange),var(--gradient-blue))] shadow-lg shadow-orange-500/20",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cn(base, variantClasses[variant], className)} {...props} />;
}

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

export function LinkButton({ variant = "primary", className, ...props }: LinkButtonProps) {
  return <Link className={cn(base, variantClasses[variant], className)} {...props} />;
}

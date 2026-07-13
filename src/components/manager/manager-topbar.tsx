import { logoutAction } from "@/lib/auth-actions";
import type { UserRole } from "@/types/next-auth";

export function ManagerTopbar({ name, role }: { name: string; role: UserRole }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {role === "MANAGER" ? "Manager" : "Team"}
        </p>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          Abmelden
        </button>
      </form>
    </header>
  );
}

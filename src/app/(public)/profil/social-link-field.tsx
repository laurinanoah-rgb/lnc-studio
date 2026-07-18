import { ModalTrigger } from "@/components/modal";
import type { SocialField } from "./actions";
import { updateSocialLink, disconnectSocialLink } from "./actions";

export function SocialLinkField({
  icon,
  label,
  field,
  value,
  placeholder,
}: {
  icon: string;
  label: string;
  field: SocialField;
  value: string | null;
  placeholder: string;
}) {
  const saveAction = updateSocialLink.bind(null, field);
  const disconnectAction = disconnectSocialLink.bind(null, field);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          {value ? (
            <p className="truncate text-xs text-muted-foreground">✓ Verknüpft: {value}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Noch nicht verknüpft</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ModalTrigger
          label={value ? "Ändern" : "Verknüpfen"}
          title={`${label} verknüpfen`}
          variant={value ? "outline" : "primary"}
        >
          <form action={saveAction} className="flex flex-col gap-4">
            <div>
              <label htmlFor={`social-${field}`} className="text-sm text-muted-foreground">
                {label}
              </label>
              <input
                id={`social-${field}`}
                name="value"
                required
                placeholder={placeholder}
                defaultValue={value ?? ""}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
            >
              Speichern
            </button>
          </form>
        </ModalTrigger>
        {value && (
          <form action={disconnectAction}>
            <button
              type="submit"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-surface-hover"
            >
              Trennen
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

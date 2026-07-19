import type { IncludedAccessory } from "@prisma/client";

export function IncludedAccessoryFields({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  item?: IncludedAccessory;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <input
        name="name"
        required
        defaultValue={item?.name}
        placeholder="Name (z. B. Endstufe für Subwoofer)"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Veröffentlicht (wird in jeder Bestätigung mit aufgeführt)
      </label>
      <button
        type="submit"
        className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        {submitLabel}
      </button>
    </form>
  );
}

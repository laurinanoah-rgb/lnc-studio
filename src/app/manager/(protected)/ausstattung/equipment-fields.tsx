import type { EquipmentItem } from "@prisma/client";
import { ImageUploadField } from "@/components/manager/image-upload-field";

export function EquipmentFields({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  item?: EquipmentItem;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <input
        name="name"
        required
        defaultValue={item?.name}
        placeholder="Name (z. B. Subwoofer)"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <ImageUploadField name="imageUrl" label="Bild" defaultValue={item?.imageUrl} />
      <input
        name="condition"
        defaultValue={item?.condition ?? ""}
        placeholder="Zustand (optional, z. B. wie neu, kleine Delle)"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Veröffentlicht (im Anfrageformular auswählbar)
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

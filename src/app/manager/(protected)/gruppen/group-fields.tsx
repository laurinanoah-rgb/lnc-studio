import type { Group } from "@prisma/client";
import { ImageUploadField } from "@/components/manager/image-upload-field";

export function GroupFields({
  action,
  group,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  group?: Group;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <input
        name="name"
        required
        defaultValue={group?.name}
        placeholder="Name"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <textarea
        name="description"
        required
        rows={3}
        defaultValue={group?.description}
        placeholder="Beschreibung"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <ImageUploadField name="coverImage" label="Titelbild" defaultValue={group?.coverImage} />
      <button
        type="submit"
        className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        {submitLabel}
      </button>
    </form>
  );
}

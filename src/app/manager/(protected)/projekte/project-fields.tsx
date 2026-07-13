import type { Project } from "@prisma/client";

export function ProjectFields({
  action,
  project,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  project?: Project;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
        <input
          name="icon"
          defaultValue={project?.icon ?? ""}
          placeholder="Icon"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          name="title"
          required
          defaultValue={project?.title}
          placeholder="Titel"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <textarea
        name="description"
        required
        rows={3}
        defaultValue={project?.description}
        placeholder="Beschreibung"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="linkLabel"
          defaultValue={project?.linkLabel ?? ""}
          placeholder="Link-Beschriftung"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          name="linkUrl"
          defaultValue={project?.linkUrl ?? ""}
          placeholder="Link-URL"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Veröffentlicht
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

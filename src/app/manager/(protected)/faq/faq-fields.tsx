import type { FaqItem } from "@prisma/client";

export function FaqFields({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  item?: FaqItem;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <input
        name="category"
        required
        defaultValue={item?.category}
        placeholder="Kategorie (z. B. Minecraft-Server - ERZMARK)"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        name="question"
        required
        defaultValue={item?.question}
        placeholder="Frage"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <textarea
        name="answer"
        required
        rows={3}
        defaultValue={item?.answer}
        placeholder="Antwort"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        {submitLabel}
      </button>
    </form>
  );
}

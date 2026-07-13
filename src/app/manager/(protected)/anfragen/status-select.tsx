"use client";

import type { InquiryStatus } from "@prisma/client";

export function StatusSelect({ defaultValue }: { defaultValue: InquiryStatus }) {
  return (
    <select
      name="status"
      defaultValue={defaultValue}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
    >
      <option value="NEU">Neu</option>
      <option value="BEARBEITUNG">In Bearbeitung</option>
      <option value="ERLEDIGT">Erledigt</option>
    </select>
  );
}

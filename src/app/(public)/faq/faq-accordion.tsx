"use client";

import { useState } from "react";
import type { FaqItem } from "@prisma/client";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="flex flex-col gap-10">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="mt-4 flex flex-col gap-2">
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const open = openId === item.id;
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-surface">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : item.id)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium"
                    >
                      {item.question}
                      <span className="shrink-0 text-lg text-accent">{open ? "–" : "+"}</span>
                    </button>
                    {open && (
                      <p className="whitespace-pre-wrap px-5 pb-4 text-sm text-muted-foreground">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Lightbox } from "./lightbox";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    images.forEach((image) => {
      if (image.category) set.add(image.category);
    });
    return Array.from(set);
  }, [images]);

  const [filter, setFilter] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = filter ? images.filter((image) => image.category === filter) : images;

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              !filter
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            Alle
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                filter === category
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((image, index) => (
          <motion.button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.title ?? ""}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {image.title && (
              <span className="absolute bottom-2 left-2 right-2 truncate text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {image.title}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            images={filtered}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onIndexChange={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

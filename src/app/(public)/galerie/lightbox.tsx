"use client";

import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import type { GalleryImage } from "@prisma/client";
import { ShareButton } from "@/components/share-button";

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const image = images[index];

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-full w-full max-w-4xl flex-col items-center"
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Vorheriges Bild"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 p-3 text-white transition-colors hover:bg-white/10"
          >
            ‹
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.title ?? ""}
          className="max-h-[70vh] w-auto rounded-xl object-contain"
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Nächstes Bild"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 p-3 text-white transition-colors hover:bg-white/10"
          >
            ›
          </button>
        )}

        <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {image.title && <p className="truncate text-sm text-white">{image.title}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={image.url}
              download
              className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
            >
              Download
            </a>
            <ShareButton
              title={image.title ?? "LNC Galerie"}
              url={`${window.location.origin}${image.url}`}
              variant="dark"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
            >
              Schließen
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

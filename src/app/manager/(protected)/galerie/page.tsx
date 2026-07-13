import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryUploadForm } from "./gallery-upload-form";
import { updateGalleryImage, deleteGalleryImage } from "./actions";
import { DeleteButton } from "@/components/manager/delete-button";

export const metadata: Metadata = { title: "Galerie" };

export default async function ManagerGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Galerie</h1>
          <p className="mt-1 text-sm text-muted-foreground">Bilder hochladen und verwalten.</p>
        </div>
        <GalleryUploadForm />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="rounded-2xl border border-border bg-surface p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.title ?? ""}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <form
              action={updateGalleryImage.bind(null, image.id)}
              className="mt-3 flex flex-col gap-2"
            >
              <input
                name="title"
                defaultValue={image.title ?? ""}
                placeholder="Titel"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                name="category"
                defaultValue={image.category ?? ""}
                placeholder="Kategorie"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="self-start text-sm text-accent hover:underline"
              >
                Speichern
              </button>
            </form>
            <div className="mt-2 flex justify-end">
              <DeleteButton action={deleteGalleryImage.bind(null, image.id)} />
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <p className="text-muted-foreground">Noch keine Bilder hochgeladen.</p>
        )}
      </div>
    </div>
  );
}

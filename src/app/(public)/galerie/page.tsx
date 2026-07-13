import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { GalleryGrid } from "./gallery-grid";

export const metadata: Metadata = { title: "Galerie" };

export default async function GaleriePage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Galerie</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Eindrücke aus unserer Arbeit.</p>

      <div className="mt-10">
        {images.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Bilder vorhanden.</p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </Container>
  );
}

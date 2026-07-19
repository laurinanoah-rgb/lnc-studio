import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { FaqAccordion } from "./faq-accordion";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">📚 FAQ</h1>
      <p className="mt-2 text-muted-foreground">Häufig gestellte Fragen.</p>

      <div className="mt-10">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Fragen hinterlegt.</p>
        ) : (
          <Reveal>
            <FaqAccordion items={items} />
          </Reveal>
        )}
      </div>
    </Container>
  );
}

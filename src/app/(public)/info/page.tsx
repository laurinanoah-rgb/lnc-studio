import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Info" };

export default async function InfoPage() {
  const content = await prisma.siteContent.upsert({
    where: { key: "info" },
    update: {},
    create: { key: "info", title: "Unsere Geschichte", body: "" },
  });

  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">📜 {content.title}</h1>
      <p className="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
        {content.body}
      </p>
    </Container>
  );
}

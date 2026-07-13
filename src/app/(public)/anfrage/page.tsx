import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = { title: "PA-Boxen Anfrage" };

export default async function AnfragePage() {
  const settings = await prisma.anfrageSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <Container className="max-w-2xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">PA-Boxen Anfrage</h1>
      <p className="mt-6 whitespace-pre-wrap text-muted-foreground">{settings.introText}</p>
      <div className="mt-10">
        <InquiryForm />
      </div>
    </Container>
  );
}

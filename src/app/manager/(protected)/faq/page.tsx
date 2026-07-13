import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/manager/delete-button";
import { createFaqItem, updateFaqItem, deleteFaqItem } from "./actions";
import { FaqFields } from "./faq-fields";

export const metadata: Metadata = { title: "FAQ" };

export default async function ManagerFaqPage() {
  const items = await prisma.faqItem.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">FAQ</h1>
      <p className="mt-1 text-sm text-muted-foreground">Häufig gestellte Fragen verwalten.</p>

      <Card className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold">Neue Frage</h2>
        <FaqFields action={createFaqItem} submitLabel="Frage anlegen" />
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <FaqFields
              action={updateFaqItem.bind(null, item.id)}
              item={item}
              submitLabel="Speichern"
            />
            <div className="mt-3 flex justify-end">
              <DeleteButton action={deleteFaqItem.bind(null, item.id)} />
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground">Noch keine FAQ-Einträge vorhanden.</p>
        )}
      </div>
    </div>
  );
}

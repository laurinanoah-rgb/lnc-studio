import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/manager/delete-button";
import {
  createEquipmentItem,
  updateEquipmentItem,
  deleteEquipmentItem,
  createIncludedAccessory,
  updateIncludedAccessory,
  deleteIncludedAccessory,
} from "./actions";
import { EquipmentFields } from "./equipment-fields";
import { IncludedAccessoryFields } from "./included-accessory-fields";

export const metadata: Metadata = { title: "Ausstattung" };

export default async function ManagerEquipmentPage() {
  const [items, includedAccessories] = await Promise.all([
    prisma.equipmentItem.findMany({ orderBy: { order: "asc" } }),
    prisma.includedAccessory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Ausstattung</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Gegenstände (z. B. Subwoofer, Top-Lautsprecher) pflegen, die im Anfrageformular unter
        „Zusätzliche Ausstattung“ mit Bild und Menge auswählbar sind.
      </p>

      <Card className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold">Neuer Gegenstand</h2>
        <EquipmentFields action={createEquipmentItem} submitLabel="Anlegen" />
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <EquipmentFields
              action={updateEquipmentItem.bind(null, item.id)}
              item={item}
              submitLabel="Speichern"
            />
            <div className="mt-3 flex justify-end">
              <DeleteButton action={deleteEquipmentItem.bind(null, item.id)} />
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground">Noch keine Ausstattung vorhanden.</p>
        )}
      </div>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">Immer inklusive Ausstattung</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Zubehör, das unabhängig von der Auswahl bei jeder Anfrage automatisch mit aufgeführt wird
        (z. B. Endstufen, Kabel).
      </p>

      <Card className="mt-8 max-w-2xl">
        <h3 className="text-lg font-semibold">Neuer Eintrag</h3>
        <IncludedAccessoryFields action={createIncludedAccessory} submitLabel="Anlegen" />
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {includedAccessories.map((item) => (
          <Card key={item.id}>
            <IncludedAccessoryFields
              action={updateIncludedAccessory.bind(null, item.id)}
              item={item}
              submitLabel="Speichern"
            />
            <div className="mt-3 flex justify-end">
              <DeleteButton action={deleteIncludedAccessory.bind(null, item.id)} />
            </div>
          </Card>
        ))}
        {includedAccessories.length === 0 && (
          <p className="text-muted-foreground">Noch kein inklusives Zubehör hinterlegt.</p>
        )}
      </div>
    </div>
  );
}

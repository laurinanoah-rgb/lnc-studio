import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Datenschutzerklärung</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Diese Seite ist ein Platzhalter. Bitte eine vollständige Datenschutzerklärung gemäß DSGVO
        ergänzen – insbesondere zur Verarbeitung der Daten aus dem Anfrageformular
        (/anfrage), zu Cookies/Analyse-Tools und zu den Rechten betroffener Personen.
      </p>
    </Container>
  );
}

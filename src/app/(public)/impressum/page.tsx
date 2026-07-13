import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Impressum</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Diese Seite ist ein Platzhalter. Bitte die vollständigen Angaben gemäß § 5 TMG ergänzen
        (Name/Firma, Anschrift, Vertretungsberechtigte, Kontakt, ggf. Handelsregister &amp;
        USt-ID).
      </p>
      <div className="mt-8 space-y-2 text-sm text-muted-foreground">
        <p>LaurinaNoahCommunity</p>
        <p>[Straße und Hausnummer]</p>
        <p>[PLZ und Ort]</p>
        <p>E-Mail: [kontakt@lnc-community.de]</p>
      </div>
    </Container>
  );
}

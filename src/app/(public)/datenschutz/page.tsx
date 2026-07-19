import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Datenschutzerklärung</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Diese Seite ist größtenteils ein Platzhalter. Bitte eine vollständige
        Datenschutzerklärung gemäß DSGVO ergänzen – insbesondere zu Cookies/Analyse-Tools, den
        verantwortlichen Kontaktdaten (siehe Impressum) und den Rechten betroffener Personen
        (Auskunft, Berichtigung, Löschung, Widerspruch).
      </p>

      <h2 className="mt-10 text-xl font-semibold">Datenverarbeitung im Anfrageformular (/anfrage)</h2>
      <div className="mt-3 space-y-3 text-sm text-muted-foreground">
        <p>
          Wenn du über das PA-Boxen-Anfrageformular eine Anfrage stellst, werden folgende Daten
          verarbeitet: Vorname, Nachname, optional Organisation/Verein, E-Mail-Adresse,
          Telefonnummer, Adresse der Veranstaltung, gewünschter Zeitraum, optionale Beschreibung
          der Veranstaltung, optional ausgewählte Ausstattung sowie dein Haftungs- und
          Datenschutz-Einverständnis samt Zeitpunkt der Anfrage.
        </p>
        <p>
          Diese Angaben werden ausschließlich zur Bearbeitung deiner Anfrage (Kontaktaufnahme,
          Terminabstimmung, Übergabe der Ausrüstung) verwendet und in der Datenbank dieser
          Website gespeichert. Eine Weitergabe an Dritte erfolgt nicht. Die Daten werden gelöscht,
          sobald sie für die Bearbeitung nicht mehr benötigt werden.
        </p>
      </div>
    </Container>
  );
}

import type { InquiryRequest } from "@prisma/client";
import { ModalTrigger } from "@/components/modal";
import { formatDate, formatDateTime, formatTime } from "@/lib/format";

type EquipmentSnapshotEntry = { itemId: string; name: string; quantity: number; condition?: string | null };

export function InquiryDetail({ inquiry }: { inquiry: InquiryRequest }) {
  const equipment = Array.isArray(inquiry.equipmentRequest)
    ? (inquiry.equipmentRequest as unknown as EquipmentSnapshotEntry[])
    : [];
  const includedAccessories = Array.isArray(inquiry.includedAccessories)
    ? (inquiry.includedAccessories as unknown as string[])
    : [];

  return (
    <ModalTrigger
      label="🔍 Details"
      title={`Anfrage von ${inquiry.firstName} ${inquiry.lastName}`}
    >
      <div className="flex flex-col gap-6 text-sm">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Kontakt
          </h3>
          <div className="mt-2 grid gap-1">
            <p>
              <span className="text-muted-foreground">Name: </span>
              {inquiry.firstName} {inquiry.lastName}
            </p>
            {inquiry.organization && (
              <p>
                <span className="text-muted-foreground">Organisation: </span>
                {inquiry.organization}
              </p>
            )}
            <p>
              <span className="text-muted-foreground">E-Mail: </span>
              {inquiry.email}
            </p>
            <p>
              <span className="text-muted-foreground">Telefon: </span>
              {inquiry.phone}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Termin & Ort
          </h3>
          <div className="mt-2 grid gap-1">
            <p>
              <span className="text-muted-foreground">Datum: </span>
              {formatDate(inquiry.neededAt)}
            </p>
            <p>
              <span className="text-muted-foreground">Uhrzeit: </span>
              {formatTime(inquiry.neededAt)} Uhr
            </p>
            <p>
              <span className="text-muted-foreground">Dauer: </span>
              {inquiry.days} Tag(e)
            </p>
            <p>
              <span className="text-muted-foreground">Adresse: </span>
              {inquiry.eventAddress}
            </p>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <iframe
              title="Kartenansicht"
              src={`https://www.google.com/maps?q=${encodeURIComponent(inquiry.eventAddress)}&output=embed`}
              className="h-48 w-full"
              loading="lazy"
            />
          </div>
        </section>

        {inquiry.eventDescription && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Beschreibung
            </h3>
            <p className="mt-2 whitespace-pre-wrap">{inquiry.eventDescription}</p>
          </section>
        )}

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Gewünschte Ausstattung
          </h3>
          {equipment.length === 0 ? (
            <p className="mt-2 text-muted-foreground">Keine zusätzliche Ausstattung ausgewählt.</p>
          ) : (
            <ul className="mt-2 list-disc pl-5">
              {equipment.map((entry) => (
                <li key={entry.itemId}>
                  {entry.name} × {entry.quantity}
                  {entry.condition && <span className="text-muted-foreground"> ({entry.condition})</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        {includedAccessories.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Immer inklusive Ausstattung
            </h3>
            <ul className="mt-2 list-disc pl-5">
              {includedAccessories.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Zustimmungen & Status
          </h3>
          <div className="mt-2 grid gap-1">
            <p>
              <span className="text-muted-foreground">Haftung akzeptiert: </span>
              {inquiry.liabilityAccepted ? "Ja" : "Nein"}
            </p>
            <p>
              <span className="text-muted-foreground">Datenschutz akzeptiert: </span>
              {inquiry.privacyAccepted ? "Ja" : "Nein"}
            </p>
            <p>
              <span className="text-muted-foreground">Status: </span>
              {inquiry.status}
            </p>
            <p>
              <span className="text-muted-foreground">Eingegangen am: </span>
              {formatDateTime(inquiry.createdAt)}
            </p>
          </div>
        </section>

        <a
          href={`/api/manager/anfragen/${inquiry.id}/pdf`}
          className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          📄 Als PDF herunterladen
        </a>
      </div>
    </ModalTrigger>
  );
}

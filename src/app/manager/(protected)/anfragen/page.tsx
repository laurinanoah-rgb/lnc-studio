import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/manager/delete-button";
import { NewRibbon } from "@/components/manager/new-ribbon";
import { approveInquiry, rejectInquiry, deleteInquiry, updateAnfrageSettings } from "./actions";
import { StatusDecision } from "./status-decision";
import { InquiryDetail } from "./inquiry-detail";
import { formatDate, formatDateTime, formatTime } from "@/lib/format";

export const metadata: Metadata = { title: "Anfragen" };

export default async function ManagerInquiriesPage() {
  const [inquiries, settings] = await Promise.all([
    prisma.inquiryRequest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.anfrageSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Anfragen</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        PA-Boxen-Anfragen bearbeiten und den Einleitungstext der Anfrageseite pflegen.
      </p>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">Einleitungstext auf /anfrage</h2>
        <form action={updateAnfrageSettings} className="mt-4 flex flex-col gap-3">
          <textarea
            name="introText"
            rows={6}
            defaultValue={settings.introText}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Speichern
          </button>
        </form>
      </Card>

      <div className="mt-8 flex flex-col gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="relative overflow-hidden">
            {inquiry.status === "NEU" && <NewRibbon />}
            <div className="flex flex-wrap items-start justify-between gap-4 pr-8">
              <div className="min-w-0">
                <p className="font-medium">
                  {inquiry.firstName} {inquiry.lastName}
                  {inquiry.organization && (
                    <span className="font-normal text-muted-foreground"> · {inquiry.organization}</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {inquiry.email} · {inquiry.phone}
                </p>
                <p className="mt-1 text-xs text-accent">{inquiry.eventAddress}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusDecision
                  status={inquiry.status}
                  onApprove={approveInquiry.bind(null, inquiry.id)}
                  onReject={rejectInquiry.bind(null, inquiry.id)}
                />
                <DeleteButton action={deleteInquiry.bind(null, inquiry.id)} />
              </div>
            </div>
            <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <p>Benötigt ab: {formatDate(inquiry.neededAt)}</p>
              <p>Uhrzeit: {formatTime(inquiry.neededAt)}</p>
              <p>Dauer: {inquiry.days} Tag(e)</p>
            </div>
            {inquiry.eventDescription && (
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                {inquiry.eventDescription}
              </p>
            )}
            {Array.isArray(inquiry.equipmentRequest) && inquiry.equipmentRequest.length > 0 && (
              <div className="mt-3 text-sm text-foreground/90">
                <p className="text-xs text-muted-foreground">Gewünschte Ausstattung:</p>
                <ul className="mt-1 list-disc pl-5">
                  {(
                    inquiry.equipmentRequest as {
                      itemId: string;
                      name: string;
                      quantity: number;
                      condition?: string | null;
                    }[]
                  ).map((entry) => (
                    <li key={entry.itemId}>
                      {entry.name} × {entry.quantity}
                      {entry.condition && (
                        <span className="text-muted-foreground"> ({entry.condition})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Haftung akzeptiert: {inquiry.liabilityAccepted ? "Ja" : "Nein"} · Datenschutz
              akzeptiert: {inquiry.privacyAccepted ? "Ja" : "Nein"} · Eingegangen am{" "}
              {formatDateTime(inquiry.createdAt)}
            </p>
            <div className="mt-3 flex justify-end">
              <InquiryDetail inquiry={inquiry} />
            </div>
          </Card>
        ))}
        {inquiries.length === 0 && (
          <p className="text-muted-foreground">Noch keine Anfragen eingegangen.</p>
        )}
      </div>
    </div>
  );
}

import type { InquiryRequest } from "@prisma/client";
import { sendMail } from "@/lib/mail";
import { formatDate, formatTime } from "@/lib/format";

type EquipmentSnapshotEntry = { itemId: string; name: string; quantity: number; condition?: string | null };

function renderDetailHtml(inquiry: InquiryRequest) {
  const equipment = Array.isArray(inquiry.equipmentRequest)
    ? (inquiry.equipmentRequest as unknown as EquipmentSnapshotEntry[])
    : [];
  const includedAccessories = Array.isArray(inquiry.includedAccessories)
    ? (inquiry.includedAccessories as unknown as string[])
    : [];

  const equipmentHtml = equipment.length
    ? `<ul>${equipment
        .map(
          (entry) =>
            `<li>${entry.name} × ${entry.quantity}${entry.condition ? ` (${entry.condition})` : ""}</li>`,
        )
        .join("")}</ul>`
    : "<p>Keine zusätzliche Ausstattung ausgewählt.</p>";

  const includedHtml = includedAccessories.length
    ? `<ul>${includedAccessories.map((name) => `<li>${name}</li>`).join("")}</ul>`
    : "";

  return `
    <p><strong>Name:</strong> ${inquiry.firstName} ${inquiry.lastName}${inquiry.organization ? ` (${inquiry.organization})` : ""}</p>
    <p><strong>Termin:</strong> ${formatDate(inquiry.neededAt)}, ${formatTime(inquiry.neededAt)} Uhr · ${inquiry.days} Tag(e)</p>
    <p><strong>Adresse:</strong> ${inquiry.eventAddress}</p>
    ${inquiry.eventDescription ? `<p><strong>Beschreibung:</strong> ${inquiry.eventDescription}</p>` : ""}
    <p><strong>Gewünschte Ausstattung:</strong></p>
    ${equipmentHtml}
    ${includedHtml ? `<p><strong>Immer inklusive:</strong></p>${includedHtml}` : ""}
  `;
}

export async function sendInquiryReceivedEmail(inquiry: InquiryRequest) {
  await sendMail({
    to: inquiry.email,
    subject: "Deine PA-Boxen Anfrage ist eingegangen 📬",
    html: `
      <h2>Danke für deine Anfrage, ${inquiry.firstName}!</h2>
      <p>Deine Anfrage ist bei uns eingegangen. Status: <strong>Offen</strong> – wir melden uns so schnell wie möglich bei dir.</p>
      ${renderDetailHtml(inquiry)}
    `,
  });
}

export async function sendInquiryApprovedEmail(inquiry: InquiryRequest) {
  await sendMail({
    to: inquiry.email,
    subject: "Deine Anfrage wurde genehmigt! 🎉",
    html: `
      <h2>Gute Neuigkeiten, ${inquiry.firstName}!</h2>
      <p>Deine Anfrage wurde genehmigt. Wir werden dich in den nächsten Tagen kontaktieren, um die Umsetzung zu besprechen.</p>
      ${renderDetailHtml(inquiry)}
    `,
  });
}

export async function sendInquiryRejectedEmail(inquiry: InquiryRequest) {
  await sendMail({
    to: inquiry.email,
    subject: "Deine Anfrage wurde leider abgelehnt",
    html: `
      <h2>Hallo ${inquiry.firstName},</h2>
      <p>Leider können wir deine Anfrage aktuell nicht umsetzen. Danke für dein Verständnis – bei Fragen melde dich gerne bei uns.</p>
      ${renderDetailHtml(inquiry)}
    `,
  });
}

import { Resend } from "resend";

let resend: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const client = getClient();
  if (!client) {
    console.warn(`[mail] RESEND_API_KEY nicht gesetzt – E-Mail an ${to} nicht gesendet.`);
    return;
  }

  await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "LNC Community <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}

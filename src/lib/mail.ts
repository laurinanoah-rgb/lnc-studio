import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const client = getTransporter();
  if (!client) {
    console.warn(`[mail] GMAIL_USER/GMAIL_APP_PASSWORD nicht gesetzt – E-Mail an ${to} nicht gesendet.`);
    return;
  }

  await client.sendMail({
    from: `LNC Community <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

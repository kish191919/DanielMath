import "server-only";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "notifications@danielmath.com";

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = getResendClient();
  await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}

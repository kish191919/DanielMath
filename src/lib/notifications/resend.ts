import "server-only";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "notifications@danielmath.com";
const SEND_TIMEOUT_MS = 5000;

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

  // Notifications are best-effort (see notifyNewMessage); a slow Resend API
  // shouldn't be able to hold the serverless invocation open indefinitely.
  const timeout = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.error("sendEmail timed out after", SEND_TIMEOUT_MS, "ms");
      resolve();
    }, SEND_TIMEOUT_MS);
  });

  await Promise.race([resend.emails.send({ from: FROM_EMAIL, to, subject, html }), timeout]);
}

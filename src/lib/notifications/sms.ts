import "server-only";
import twilio from "twilio";

const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

// Normalizes a US phone number to E.164 (+1XXXXXXXXXX), as Twilio requires.
// Returns null for anything that isn't a plain 10-digit US number or an
// 11-digit one already carrying the country code.
export function normalizeUsPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

// Best-effort SMS send — mirrors sendEmail() in resend.ts: env-var gated,
// silently no-ops (with a log) if Twilio isn't configured. Send failures
// are left to propagate so callers can decide how to handle them per
// recipient (see notifyGuardiansOfReport in learning-history/actions.ts).
export async function sendSms({ to, body }: { to: string; body: string }): Promise<void> {
  const client = getClient();
  if (!client || !FROM_NUMBER) {
    console.error("[sms] skipped — missing TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_FROM_NUMBER");
    return;
  }

  await client.messages.create({ to, from: FROM_NUMBER, body });
}

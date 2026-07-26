import "server-only";
import Twilio from "twilio";

export function getTwilioClient() {
  return Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendSms({ to, body }: { to: string; body: string }) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return;
  const client = getTwilioClient();
  await client.messages.create({ to, from: process.env.TWILIO_FROM_NUMBER, body });
}

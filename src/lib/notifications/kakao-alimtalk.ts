import "server-only";
import { SolapiMessageService } from "solapi";

const PF_ID = process.env.SOLAPI_KAKAO_PF_ID;
const TEMPLATE_ID = process.env.SOLAPI_ALIMTALK_TEMPLATE_ID;
const SENDER_PHONE = process.env.SOLAPI_SENDER_PHONE;

function getClient(): SolapiMessageService | null {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  return new SolapiMessageService(apiKey, apiSecret);
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// Best-effort AlimTalk send — mirrors sendEmail() in resend.ts: env-var
// gated, never throws. A missing template/pfId/key must never fail the
// report publish that triggered this.
export async function sendReportAlimTalk({
  toPhone,
  variables,
}: {
  toPhone: string;
  variables: Record<string, string>;
}): Promise<void> {
  try {
    const client = getClient();
    if (!client || !PF_ID || !TEMPLATE_ID) {
      console.error(
        "[kakao-alimtalk] skipped — missing SOLAPI_API_KEY/SOLAPI_API_SECRET/SOLAPI_KAKAO_PF_ID/SOLAPI_ALIMTALK_TEMPLATE_ID",
      );
      return;
    }

    const to = normalizePhone(toPhone);
    if (to.length < 9) {
      console.error("[kakao-alimtalk] skipped — invalid phone number");
      return;
    }

    await client.send({
      to,
      from: SENDER_PHONE ? normalizePhone(SENDER_PHONE) : undefined,
      kakaoOptions: {
        pfId: PF_ID,
        templateId: TEMPLATE_ID,
        variables,
        // No SMS fallback: parents haven't consented to plain SMS, and its
        // content would differ from the approved AlimTalk template.
        disableSms: true,
      },
    });
  } catch (error) {
    console.error("sendReportAlimTalk failed", error);
  }
}

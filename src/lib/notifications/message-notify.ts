import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { MessageThread, Profile } from "@/lib/supabase/types";
import { sendEmail } from "./resend";
import { sendSms } from "./twilio";

const DASHBOARD_URL = "https://danielmath.com/dashboard";

// Best-effort notification fan-out for a newly sent in-app message. Never
// throws — a notification failure (missing API key, bad phone number, etc.)
// must not fail the message send itself. Message content is intentionally
// not included in the email/SMS body, only a link to log in and read it.
export async function notifyNewMessage({
  thread,
  isPrincipalSender,
}: {
  thread: MessageThread;
  isPrincipalSender: boolean;
}) {
  try {
    if (isPrincipalSender) {
      await notifyParent(thread.parent_id);
    } else {
      await notifyPrincipal();
    }
  } catch (error) {
    console.error("notifyNewMessage failed", error);
  }
}

async function notifyPrincipal() {
  const email = process.env.PRINCIPAL_NOTIFY_EMAIL;
  const phone = process.env.PRINCIPAL_NOTIFY_PHONE;
  const subject = "새 메시지가 도착했습니다";
  const body = "학부모님으로부터 새 메시지가 도착했습니다. 대시보드에서 확인해주세요.";

  if (email) {
    await sendEmail({ to: email, subject, html: emailBody(body) });
  }
  if (phone) {
    await sendSms({ to: phone, body: `${body} ${DASHBOARD_URL}` });
  }
}

async function notifyParent(parentId: string) {
  const supabase = await createServerSupabase();
  const { data: parent } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", parentId)
    .maybeSingle<Profile>();
  if (!parent) return;

  const subject = "새 메시지가 도착했습니다";
  const body = "선생님으로부터 새 메시지가 도착했습니다. 대시보드에서 확인해주세요.";

  await sendEmail({ to: parent.email, subject, html: emailBody(body) });

  if (parent.phone && parent.sms_opt_in) {
    await sendSms({ to: parent.phone, body: `${body} ${DASHBOARD_URL}` });
  }
}

function emailBody(message: string) {
  return `<p>${message}</p><p><a href="${DASHBOARD_URL}">${DASHBOARD_URL}</a></p>`;
}

import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { MessageThread, Profile } from "@/lib/supabase/types";
import { sendEmail } from "./resend";

const DASHBOARD_URL = "https://danielmath.com/dashboard";

// Best-effort email notification for a newly sent in-app message. Never
// throws — a notification failure (missing API key, etc.) must not fail
// the message send itself. Message content is intentionally not included
// in the email body, only a link to log in and read it.
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
  if (!email) return;

  await sendEmail({
    to: email,
    subject: "새 메시지가 도착했습니다",
    html: emailBody("학부모님으로부터 새 메시지가 도착했습니다. 대시보드에서 확인해주세요."),
  });
}

async function notifyParent(parentId: string) {
  const supabase = await createServerSupabase();
  const { data: parent } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", parentId)
    .maybeSingle<Profile>();
  if (!parent) return;

  await sendEmail({
    to: parent.email,
    subject: "새 메시지가 도착했습니다",
    html: emailBody("선생님으로부터 새 메시지가 도착했습니다. 대시보드에서 확인해주세요."),
  });
}

function emailBody(message: string) {
  return `<p>${message}</p><p><a href="${DASHBOARD_URL}">${DASHBOARD_URL}</a></p>`;
}

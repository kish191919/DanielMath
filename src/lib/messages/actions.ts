"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Message, MessageThread } from "@/lib/supabase/types";
import { notifyNewMessage } from "@/lib/notifications/message-notify";
import { messageBodySchema } from "./schema";

export type SendMessageFormState = {
  error?: string;
};

async function verifyParticipant(threadId: string, userId: string, isPrincipal: boolean) {
  const supabase = await createServerSupabase();
  const { data: thread } = await supabase
    .from("message_threads")
    .select("*")
    .eq("id", threadId)
    .maybeSingle<MessageThread>();

  if (!thread) throw new Error("메시지 스레드를 찾을 수 없습니다.");
  if (!isPrincipal && thread.parent_id !== userId) {
    throw new Error("이 대화에 접근할 권한이 없습니다.");
  }
  return thread;
}

export async function sendMessageAction(
  threadId: string,
  _prev: SendMessageFormState | null,
  formData: FormData,
): Promise<SendMessageFormState> {
  const session = await requireSession();
  const isPrincipal = session.profile.role === "principal";

  const parsed = messageBodySchema.safeParse(formData.get("body"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "메시지를 입력해주세요." };
  }

  const thread = await verifyParticipant(threadId, session.userId, isPrincipal);

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("messages").insert({
    thread_id: threadId,
    sender_id: session.userId,
    body: parsed.data,
  });
  if (error) return { error: error.message };

  // Best-effort preview update, same pattern as inquiries' secondary status
  // update — a failure here shouldn't fail the send itself.
  await supabase
    .from("message_threads")
    .update({
      last_message_at: new Date().toISOString(),
      last_message_body: parsed.data.slice(0, 200),
      last_sender_id: session.userId,
    })
    .eq("id", threadId);

  // Best-effort email notification — see notifyNewMessage for why this
  // never throws.
  await notifyNewMessage({ thread, isPrincipalSender: isPrincipal });

  revalidatePath(isPrincipal ? "/dashboard/principal/messages" : "/dashboard/parent/messages");
  return {};
}

export async function deleteMessageAction(threadId: string, messageId: string): Promise<void> {
  const session = await requireSession();
  const isPrincipal = session.profile.role === "principal";

  await verifyParticipant(threadId, session.userId, isPrincipal);

  const supabase = await createServerSupabase();
  const { data: message } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("id", messageId)
    .maybeSingle<Pick<Message, "sender_id">>();

  if (!message) throw new Error("메시지를 찾을 수 없습니다.");
  if (!isPrincipal && message.sender_id !== session.userId) {
    throw new Error("본인이 보낸 메시지만 삭제할 수 있습니다.");
  }

  const { error } = await supabase
    .from("messages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) throw new Error(error.message);

  revalidatePath(isPrincipal ? "/dashboard/principal/messages" : "/dashboard/parent/messages");
}

export async function markThreadReadAction(threadId: string): Promise<void> {
  const session = await requireSession();
  const isPrincipal = session.profile.role === "principal";

  await verifyParticipant(threadId, session.userId, isPrincipal);

  const supabase = await createServerSupabase();
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .neq("sender_id", session.userId)
    .is("read_at", null);
}

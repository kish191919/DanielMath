import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Message, MessageThread, Profile } from "@/lib/supabase/types";
import type { Session } from "@/lib/dal";

export async function getOrCreateThreadForParent(parentId: string): Promise<MessageThread> {
  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("message_threads")
    .select("*")
    .eq("parent_id", parentId)
    .maybeSingle<MessageThread>();
  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("message_threads")
    .insert({ parent_id: parentId })
    .select("*")
    .maybeSingle<MessageThread>();
  if (created) return created;

  // Concurrent first-view from two tabs can race past the select-above; the
  // unique constraint on parent_id means at most one insert actually lands.
  const { data: retry } = await supabase
    .from("message_threads")
    .select("*")
    .eq("parent_id", parentId)
    .maybeSingle<MessageThread>();
  if (retry) return retry;

  throw new Error(error?.message ?? "메시지 스레드를 생성하지 못했습니다.");
}

export async function listParentProfiles(): Promise<Profile[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "parent")
    .order("full_name", { ascending: true })
    .returns<Profile[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getParentProfile(id: string): Promise<Profile | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "parent")
    .maybeSingle<Profile>();

  return data ?? null;
}

export async function listMessageThreads(): Promise<MessageThread[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .returns<MessageThread[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listMessagesForThread(threadId: string): Promise<Message[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .returns<Message[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listUnreadMessages(): Promise<Pick<Message, "thread_id" | "sender_id">[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("thread_id, sender_id")
    .is("read_at", null)
    .returns<Pick<Message, "thread_id" | "sender_id">[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

// Counts messages sent by "the other side" that this session hasn't read
// yet. RLS already scopes listUnreadMessages() to the threads this session
// can see (all threads for a principal, one thread for a parent), so
// filtering out this session's own messages is the only step needed here.
export async function getUnreadCount(session: Session): Promise<number> {
  const unread = await listUnreadMessages();
  return unread.filter((message) => message.sender_id !== session.userId).length;
}

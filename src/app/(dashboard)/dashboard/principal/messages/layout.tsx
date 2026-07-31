import Link from "next/link";
import { requireRole } from "@/lib/dal";
import { listParentProfiles, listMessageThreads, listUnreadMessages } from "@/lib/messages/queries";
import { listDuplicateParentCandidates } from "@/lib/parents/queries";
import { ThreadSidebar } from "@/components/messages/thread-sidebar";
import { UnreadNavListener } from "@/components/messages/unread-nav-listener";
import type { MessageThread } from "@/lib/supabase/types";

export default async function PrincipalMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("principal");

  const [parents, threads, unread, duplicateGroups] = await Promise.all([
    listParentProfiles(),
    listMessageThreads(),
    listUnreadMessages(),
    listDuplicateParentCandidates(),
  ]);

  const threadsByParent: Record<string, MessageThread> = {};
  for (const thread of threads) threadsByParent[thread.parent_id] = thread;

  const unreadCounts: Record<string, number> = {};
  for (const message of unread) {
    if (message.sender_id === session.userId) continue;
    unreadCounts[message.thread_id] = (unreadCounts[message.thread_id] ?? 0) + 1;
  }

  return (
    <div className="grid h-[calc(100dvh-8rem)] grid-cols-1 sm:grid-cols-[280px_1fr]">
      <div className="overflow-y-auto border-r border-navy-100 bg-white p-2">
        <UnreadNavListener />
        {duplicateGroups.length > 0 && (
          <Link
            href="/dashboard/principal/messages/duplicates"
            className="mb-2 block rounded-md bg-gold-300/20 px-3 py-2 text-xs font-medium text-navy-800 hover:bg-gold-300/30"
          >
            중복 학부모 계정 {duplicateGroups.length}건 발견 — 정리
          </Link>
        )}
        <ThreadSidebar
          parents={parents}
          threadsByParent={threadsByParent}
          unreadCounts={unreadCounts}
        />
      </div>
      <div className="min-h-0">{children}</div>
    </div>
  );
}

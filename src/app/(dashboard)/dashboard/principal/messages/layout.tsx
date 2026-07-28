import { requireRole } from "@/lib/dal";
import { listParentProfiles, listMessageThreads, listUnreadMessages } from "@/lib/messages/queries";
import { ThreadSidebar } from "@/components/messages/thread-sidebar";
import { UnreadNavListener } from "@/components/messages/unread-nav-listener";
import type { MessageThread } from "@/lib/supabase/types";

export default async function PrincipalMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("principal");

  const [parents, threads, unread] = await Promise.all([
    listParentProfiles(),
    listMessageThreads(),
    listUnreadMessages(),
  ]);

  const threadsByParent: Record<string, MessageThread> = {};
  for (const thread of threads) threadsByParent[thread.parent_id] = thread;

  const unreadCounts: Record<string, number> = {};
  for (const message of unread) {
    if (message.sender_id === session.userId) continue;
    unreadCounts[message.thread_id] = (unreadCounts[message.thread_id] ?? 0) + 1;
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 sm:grid-cols-[280px_1fr]">
      <div className="overflow-y-auto border-r border-navy-100 bg-white p-2">
        <UnreadNavListener />
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

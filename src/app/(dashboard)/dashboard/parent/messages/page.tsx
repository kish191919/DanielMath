import { requireRole } from "@/lib/dal";
import { getOrCreateThreadForParent, listMessagesForThread } from "@/lib/messages/queries";
import { ThreadView } from "@/components/messages/thread-view";
import { UnreadNavListener } from "@/components/messages/unread-nav-listener";

export default async function ParentMessagesPage() {
  const session = await requireRole("parent");

  const thread = await getOrCreateThreadForParent(session.userId);
  const messages = await listMessagesForThread(thread.id);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <UnreadNavListener />
      <ThreadView
        threadId={thread.id}
        initialMessages={messages}
        currentUserId={session.userId}
        otherPartyLabel="원장님"
        isPrincipal={session.profile.role === "principal"}
      />
    </div>
  );
}

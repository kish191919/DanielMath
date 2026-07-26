import { notFound } from "next/navigation";
import { requireRole } from "@/lib/dal";
import {
  getParentProfile,
  getOrCreateThreadForParent,
  listMessagesForThread,
} from "@/lib/messages/queries";
import { ThreadView } from "@/components/messages/thread-view";

export default async function PrincipalMessageThreadPage({
  params,
}: {
  params: Promise<{ parentId: string }>;
}) {
  const session = await requireRole("principal");
  const { parentId } = await params;

  const parent = await getParentProfile(parentId);
  if (!parent) notFound();

  const thread = await getOrCreateThreadForParent(parentId);
  const messages = await listMessagesForThread(thread.id);

  return (
    <ThreadView
      key={thread.id}
      threadId={thread.id}
      initialMessages={messages}
      currentUserId={session.userId}
      otherPartyLabel={parent.full_name ?? parent.email}
    />
  );
}

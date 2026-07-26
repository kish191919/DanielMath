"use client";

import { usePathname } from "next/navigation";
import type { MessageThread, Profile } from "@/lib/supabase/types";
import { ThreadListItem } from "./thread-list-item";

export function ThreadSidebar({
  parents,
  threadsByParent,
  unreadThreadIds,
}: {
  parents: Profile[];
  threadsByParent: Record<string, MessageThread>;
  unreadThreadIds: string[];
}) {
  const pathname = usePathname();
  const activeParentId = pathname.split("/dashboard/principal/messages/")[1];
  const unreadSet = new Set(unreadThreadIds);

  if (parents.length === 0) {
    return (
      <p className="p-3 text-sm text-navy-500 font-ko" lang="ko">
        등록된 학부모가 없습니다.
      </p>
    );
  }

  return (
    <>
      {parents.map((parent) => {
        const thread = threadsByParent[parent.id];
        return (
          <ThreadListItem
            key={parent.id}
            parent={parent}
            thread={thread}
            hasUnread={Boolean(thread && unreadSet.has(thread.id))}
            isActive={activeParentId === parent.id}
          />
        );
      })}
    </>
  );
}

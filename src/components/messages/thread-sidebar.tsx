"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import type { MessageThread, Profile } from "@/lib/supabase/types";
import { ThreadListItem } from "./thread-list-item";

export function ThreadSidebar({
  parents,
  threadsByParent,
  unreadCounts,
}: {
  parents: Profile[];
  threadsByParent: Record<string, MessageThread>;
  unreadCounts: Record<string, number>;
}) {
  const pathname = usePathname();
  const activeParentId = pathname.split("/dashboard/principal/messages/")[1];
  const [query, setQuery] = React.useState("");

  const sortedParents = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? parents.filter((p) => (p.full_name ?? p.email).toLowerCase().includes(q))
      : parents;

    return [...filtered].sort((a, b) => {
      const threadA = threadsByParent[a.id];
      const threadB = threadsByParent[b.id];
      const unreadA = unreadCounts[threadA?.id ?? ""] ?? 0;
      const unreadB = unreadCounts[threadB?.id ?? ""] ?? 0;
      if ((unreadA > 0) !== (unreadB > 0)) return unreadA > 0 ? -1 : 1;

      const timeA = threadA?.last_message_at ? new Date(threadA.last_message_at).getTime() : 0;
      const timeB = threadB?.last_message_at ? new Date(threadB.last_message_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;

      return (a.full_name ?? "").localeCompare(b.full_name ?? "", "ko");
    });
  }, [parents, threadsByParent, unreadCounts, query]);

  if (parents.length === 0) {
    return (
      <p className="p-3 text-sm text-navy-500 font-ko" lang="ko">
        등록된 학부모가 없습니다.
      </p>
    );
  }

  return (
    <>
      <div className="p-1 pb-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학부모 이름으로 검색"
          className="h-9 text-sm"
        />
      </div>
      {sortedParents.length === 0 ? (
        <p className="p-3 text-sm text-navy-500 font-ko" lang="ko">
          검색 결과가 없습니다.
        </p>
      ) : (
        sortedParents.map((parent) => {
          const thread = threadsByParent[parent.id];
          return (
            <ThreadListItem
              key={parent.id}
              parent={parent}
              thread={thread}
              unreadCount={unreadCounts[thread?.id ?? ""] ?? 0}
              isActive={activeParentId === parent.id}
            />
          );
        })
      )}
    </>
  );
}

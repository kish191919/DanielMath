import Link from "next/link";
import type { MessageThread, Profile } from "@/lib/supabase/types";

export function ThreadListItem({
  parent,
  thread,
  unreadCount,
  isActive,
}: {
  parent: Profile;
  thread: MessageThread | undefined;
  unreadCount: number;
  isActive: boolean;
}) {
  return (
    <Link
      href={`/dashboard/principal/messages/${parent.id}`}
      className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        isActive ? "bg-navy-900 text-white" : "hover:bg-navy-50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate font-medium font-ko ${isActive ? "text-white" : "text-navy-900"}`}
            lang="ko"
          >
            {parent.full_name ?? parent.email}
          </p>
          {unreadCount > 0 && (
            <span
              className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
              aria-label={`안 읽은 메시지 ${unreadCount}개`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <p
          className={`mt-0.5 truncate text-xs font-ko ${isActive ? "text-navy-100" : "text-navy-500"}`}
          lang="ko"
        >
          {thread?.last_message_body ?? "대화를 시작해보세요"}
        </p>
      </div>
    </Link>
  );
}

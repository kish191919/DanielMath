import type { Message } from "@/lib/supabase/types";

export function MessageBubbleList({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string;
}) {
  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-navy-500 font-ko" lang="ko">
        아직 메시지가 없습니다. 첫 메시지를 보내보세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;
        return (
          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm font-ko ${
                isOwn
                  ? "bg-navy-900 text-white"
                  : "border border-navy-100 bg-white text-navy-900"
              }`}
              lang="ko"
            >
              <p className="whitespace-pre-line">{message.body}</p>
              <p className={`mt-1 text-[10px] ${isOwn ? "text-navy-200" : "text-navy-400"}`}>
                {new Date(message.created_at).toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

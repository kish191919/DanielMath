import type { Message } from "@/lib/supabase/types";
import { deleteMessageAction } from "@/lib/messages/actions";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";

export function MessageBubbleList({
  messages,
  currentUserId,
  threadId,
  isPrincipal,
}: {
  messages: Message[];
  currentUserId: string;
  threadId: string;
  isPrincipal: boolean;
}) {
  if (messages.length === 0) {
    return isPrincipal ? (
      <p className="py-8 text-center text-sm text-navy-500 font-ko" lang="ko">
        아직 메시지가 없습니다. 첫 메시지를 보내보세요.
      </p>
    ) : (
      <p className="py-8 text-center text-sm text-navy-500">
        No messages yet. Send the first one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;
        const canDelete = !message.deleted_at && (isOwn || isPrincipal);
        return (
          <div
            key={message.id}
            className={`group flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                isPrincipal ? "font-ko" : ""
              } ${
                isOwn
                  ? "bg-navy-900 text-white"
                  : "border border-navy-100 bg-white text-navy-900"
              }`}
              lang={isPrincipal ? "ko" : undefined}
            >
              {message.deleted_at ? (
                <p className={`italic ${isOwn ? "text-navy-300" : "text-navy-400"}`}>
                  {isPrincipal ? "삭제된 메시지입니다" : "This message was deleted"}
                </p>
              ) : (
                <p className="whitespace-pre-line">{message.body}</p>
              )}
              <div className="mt-1 flex items-center gap-2">
                <p className={`text-[10px] ${isOwn ? "text-navy-200" : "text-navy-400"}`}>
                  {new Date(message.created_at).toLocaleString(isPrincipal ? "ko-KR" : "en-US")}
                </p>
                {canDelete && (
                  <form action={deleteMessageAction.bind(null, threadId, message.id)}>
                    <ConfirmSubmitButton
                      label={isPrincipal ? "삭제" : "Delete"}
                      confirmMessage={isPrincipal ? "이 메시지를 삭제할까요?" : "Delete this message?"}
                      className={`text-[10px] underline opacity-0 transition-opacity group-hover:opacity-100 ${
                        isOwn ? "text-navy-200" : "text-navy-400"
                      }`}
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

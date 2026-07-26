"use client";

import * as React from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import type { Message } from "@/lib/supabase/types";
import { markThreadReadAction } from "@/lib/messages/actions";
import { MessageBubbleList } from "./message-bubble-list";
import { MessageComposer } from "./message-composer";

export function ThreadView({
  threadId,
  initialMessages,
  currentUserId,
  otherPartyLabel,
}: {
  threadId: string;
  initialMessages: Message[];
  currentUserId: string;
  otherPartyLabel: string;
}) {
  const [messages, setMessages] = React.useState(initialMessages);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const supabase = createBrowserSupabase();
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` },
        (payload) => {
          const message = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` },
        (payload) => {
          const message = payload.new as Message;
          setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  React.useEffect(() => {
    markThreadReadAction(threadId);
  }, [threadId]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-navy-100 px-4 py-3">
        <p className="text-sm font-semibold text-navy-900 font-ko" lang="ko">
          {otherPartyLabel}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageBubbleList messages={messages} currentUserId={currentUserId} />
        <div ref={bottomRef} />
      </div>
      <MessageComposer threadId={threadId} />
    </div>
  );
}

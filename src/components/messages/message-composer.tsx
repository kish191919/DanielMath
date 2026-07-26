"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageAction, type SendMessageFormState } from "@/lib/messages/actions";
import { MESSAGE_BODY_MAX } from "@/lib/messages/schema";

export function MessageComposer({ threadId }: { threadId: string }) {
  const action = sendMessageAction.bind(null, threadId);
  const [state, formAction, isPending] = useActionState<SendMessageFormState | null, FormData>(
    action,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (!state?.error) formRef.current?.reset();
  }, [state]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-2 border-t border-navy-100 p-3">
      <Textarea
        name="body"
        placeholder="메시지를 입력하세요"
        maxLength={MESSAGE_BODY_MAX}
        onKeyDown={handleKeyDown}
        className="min-h-16"
      />
      {state?.error && (
        <p className="text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="md" className="h-8 px-4 text-xs" disabled={isPending}>
          {isPending ? "전송 중..." : "전송"}
        </Button>
      </div>
    </form>
  );
}

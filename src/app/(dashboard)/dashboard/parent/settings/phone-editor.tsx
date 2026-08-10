"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePhoneAction, type UpdatePhoneState } from "@/lib/profile/actions";

export function PhoneEditor({ defaultValue }: { defaultValue: string }) {
  const [state, formAction, isPending] = useActionState<UpdatePhoneState | null, FormData>(
    updatePhoneAction,
    null,
  );
  const [dirty, setDirty] = React.useState(false);
  const [prevState, setPrevState] = React.useState(state);

  if (state !== prevState) {
    setPrevState(state);
    setDirty(false);
  }

  return (
    <form action={formAction} className="space-y-2">
      <label htmlFor="phone" className="block text-sm font-medium text-navy-900">
        Phone Number
      </label>
      <Input
        type="tel"
        name="phone"
        id="phone"
        defaultValue={defaultValue}
        placeholder="010-1234-5678"
        disabled={isPending}
        onChange={() => setDirty(true)}
        className="max-w-xs"
      />
      {state?.error && (
        <p className="text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && !dirty && (
        <p className="text-xs text-navy-600" role="status">
          Saved.
        </p>
      )}
      <Button type="submit" size="md" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}

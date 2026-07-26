"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const DEBOUNCE_MS = 500;

// Keeps the dashboard nav's unread badge live without polling. RLS scopes
// what each session actually receives from these unfiltered subscriptions
// (all threads for a principal, one thread for a parent), so a plain
// router.refresh() re-runs the server-side unread count correctly for
// whoever is signed in.
export function UnreadNavListener() {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createBrowserSupabase();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function scheduleRefresh() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => router.refresh(), DEBOUNCE_MS);
    }

    const channel = supabase
      .channel("unread-nav")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, scheduleRefresh)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_threads" },
        scheduleRefresh,
      )
      .subscribe();

    return () => {
      clearTimeout(timeoutId);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 3000;

// Grading now runs in the background (see confirmUploadAction/retryGradingAction),
// so this page can be rendered while scan.status is still "grading". Poll via
// router.refresh() until the server-rendered status flips away from "grading"
// (passed back in as isGrading=false), at which point the effect cleans up
// and polling stops on its own — no separate "done" signal needed.
export function GradingStatusPoller({ isGrading }: { isGrading: boolean }) {
  const router = useRouter();

  React.useEffect(() => {
    if (!isGrading) return;
    const id = setInterval(() => router.refresh(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isGrading, router]);

  return null;
}

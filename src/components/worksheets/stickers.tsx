"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Skills a student marked as finished. Kept in this browser only: it is a
// reward sticker, and nothing else depends on it, so a private window or
// blocked storage just means no stickers.
const KEY = "dm-worksheet-stickers";
const CHANGE = "dm-worksheet-stickers-change";

function read(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

export function useStickers() {
  // The server snapshot is empty, so static pages hydrate without stickers
  // and fill them in on the client.
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const done = useMemo(() => {
    try {
      const list: unknown = JSON.parse(raw);
      return new Set(Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : []);
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(done);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        return;
      }
      window.dispatchEvent(new Event(CHANGE));
    },
    [done],
  );

  return { done, toggle };
}

export function StickerButton({ id, isKo }: { id: string; isKo: boolean }) {
  const { done, toggle } = useStickers();
  const [popping, setPopping] = useState(false);
  const has = done.has(id);

  return (
    <button
      type="button"
      onClick={() => {
        if (!has) setPopping(true);
        toggle(id);
      }}
      aria-pressed={has}
      title={has ? (isKo ? "다시 누르면 스티커를 뗄 수 있어요" : "Click again to take the sticker off") : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
        has
          ? "bg-amber-50 text-amber-800 ring-1 ring-amber-300 hover:bg-amber-100"
          : "bg-white text-navy-800 ring-1 ring-navy-200 hover:bg-amber-50 hover:text-amber-800 hover:ring-amber-300",
        isKo && "font-ko",
      )}
    >
      <Star
        onAnimationEnd={() => setPopping(false)}
        className={cn(
          "h-4 w-4",
          has ? "fill-amber-400 text-amber-500" : "text-amber-500",
          popping && "motion-safe:animate-sticker-pop",
        )}
      />
      {has ? (isKo ? "스티커 받았어요!" : "Sticker earned!") : isKo ? "다 풀었어요 · 스티커 받기" : "Done! Get a sticker"}
    </button>
  );
}

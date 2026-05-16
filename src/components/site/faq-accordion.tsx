"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };

export function FaqAccordion({
  items,
  isKo = false,
}: {
  items: FaqItem[];
  isKo?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-10 max-w-3xl divide-y divide-navy-100">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={cn(
                "flex w-full items-center justify-between gap-4 py-6 text-left",
                "transition-colors hover:text-navy-600",
              )}
              aria-expanded={isOpen}
            >
              <span className={cn("text-base font-bold text-navy-900", isKo && "font-ko")}>
                Q. {faq.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-navy-500 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className={cn("pb-6 text-sm leading-7 text-navy-700", isKo && "font-ko")}>
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

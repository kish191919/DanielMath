import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  titleKo,
  description,
  align = "center",
  isKo = false,
}: {
  eyebrow?: string;
  title: string;
  titleKo?: string;
  description?: string;
  align?: "center" | "left";
  isKo?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && (
        <p className={cn("mb-3 text-sm font-semibold uppercase tracking-wider text-navy-500", isKo && "font-ko")}>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl", isKo && "font-ko")}>
        {title}
      </h2>
      {titleKo && (
        <p className="mt-2 text-lg text-navy-500">
          {titleKo}
        </p>
      )}
      {description && (
        <p className={cn("mt-5 text-base leading-7 text-navy-700 sm:text-lg", isKo && "font-ko")}>
          {description}
        </p>
      )}
    </div>
  );
}

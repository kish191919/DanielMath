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
}: {
  eyebrow?: string;
  title: string;
  titleKo?: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        {title}
      </h2>
      {titleKo && (
        <p className="mt-2 text-2xl font-semibold text-navy-700 sm:text-3xl font-ko" lang="ko">
          {titleKo}
        </p>
      )}
      {description && (
        <p className="mt-5 text-base leading-7 text-navy-700 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

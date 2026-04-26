"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const images = [
  { src: "/hero/student-1.jpg", alt: "" },
  { src: "/hero/student-2.jpg", alt: "" },
] as const;

export function HeroBackground({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn(
            "absolute inset-0 -z-20 object-cover transition-opacity duration-[1500ms] ease-in-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/70 via-navy-900/65 to-navy-950/80" />
      {children}
    </section>
  );
}

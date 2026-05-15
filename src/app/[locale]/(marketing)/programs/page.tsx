import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Brain, FileText, LineChart, Sparkles, Clock, Users, CalendarDays } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

const TEXTBOOK_IMAGES: Record<string, { src: string; unoptimized?: boolean }> = {
  "Singapore Math": { src: "/textbooks/singapore-math.png" },
  "Beast Academy": { src: "/textbooks/beast-academy.png" },
  "IXL Math": { src: "/textbooks/ixl-math.png" },
  "CogAT / NNAT": { src: "/textbooks/cogat-nnat.svg", unoptimized: true },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.programs.meta.title,
    description: d.programs.meta.description,
  };
}

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const p = d.programs;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";
  const icons = [FileText, Brain, Sparkles, LineChart];
  const opsIcons = [CalendarDays, Clock, Users];

  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow={p.header.eyebrow}
            title={p.header.title}
            titleKo={p.header.titleKo || undefined}
            description={p.header.desc}
            isKo={isKo}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {p.pillars.map((pillar, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-navy-100 bg-white p-7 shadow-sm"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  {isKo ? (
                    <h3 className="mt-5 text-xl font-bold text-navy-900 font-ko" lang="ko">{pillar.titleKo}</h3>
                  ) : (
                    <h3 className="mt-5 text-xl font-bold text-navy-900">{pillar.title}</h3>
                  )}
                  <p className={`mt-3 text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-navy-50/60">
        <Container>
          <SectionHeader
            eyebrow={p.coverage.eyebrow}
            title={p.coverage.title}
            titleKo={p.coverage.titleKo || undefined}
            description={p.coverage.desc}
            isKo={isKo}
          />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {p.coverage.chips.map((c) => {
              const img = TEXTBOOK_IMAGES[c.label];
              return (
                <div key={c.label} className="flex flex-col items-center gap-3">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-md bg-white">
                    {img && (
                      <Image
                        src={img.src}
                        alt={c.label}
                        fill
                        unoptimized={img.unoptimized}
                        className="object-cover"
                        sizes="(min-width: 640px) 25vw, 50vw"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-navy-900">{c.label}</p>
                    {c.sublabel && (
                      <p className={`text-xs text-navy-600${isKo ? " font-ko" : ""}`}>
                        {c.sublabel}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow={p.ops.eyebrow}
            title={p.ops.title}
            titleKo={p.ops.titleKo || undefined}
            isKo={isKo}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {p.ops.items.map((o, i) => {
              const Icon = opsIcons[i];
              return (
                <div key={o.label} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className={`text-xs font-semibold uppercase tracking-wider text-navy-500${isKo ? " font-ko" : ""}`}>
                      {o.label}
                    </p>
                  </div>
                  <p className={`mt-4 text-lg font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>{o.value}</p>
                  {o.sublabel && <p className="mt-0.5 text-sm text-navy-600">{o.sublabel}</p>}
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-lg text-center space-y-2">
            <p className={`text-sm font-semibold text-navy-700${isKo ? " font-ko" : ""}`}>
              {p.ops.noteHeader}
            </p>
            <div className="space-y-1">
              {p.ops.scheduleRows.map((row: string, i: number) => (
                <p key={i} className={`text-sm text-navy-500${isKo ? " font-ko" : ""}`}>
                  {row}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button href={lp("/inquire")} size="lg">
              {p.ops.cta}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

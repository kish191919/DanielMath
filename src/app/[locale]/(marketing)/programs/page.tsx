import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Brain, FileText, LineChart, Sparkles, Clock, Users, CalendarDays } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

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
                  <h3 className="mt-5 text-xl font-bold text-navy-900">{pillar.title}</h3>
                  {pillar.titleKo && (
                    <p className="mt-1 text-base font-semibold text-navy-700 font-ko" lang="ko">
                      {pillar.titleKo}
                    </p>
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
          />
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {p.coverage.chips.map((c) => (
              <div
                key={c.label}
                className="flex items-baseline gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                <span className="font-semibold text-navy-900">{c.label}</span>
                {c.sublabel && (
                  <span className={`text-xs text-navy-600${isKo ? " font-ko" : ""}`}>
                    {c.sublabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow={p.ops.eyebrow}
            title={p.ops.title}
            titleKo={p.ops.titleKo || undefined}
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
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                      {o.label}
                    </p>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-navy-900">{o.value}</p>
                  {o.sublabel && <p className="mt-0.5 text-sm text-navy-600">{o.sublabel}</p>}
                </div>
              );
            })}
          </div>

          <p className={`mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {p.ops.note}
          </p>

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

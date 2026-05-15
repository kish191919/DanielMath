import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, GraduationCap, CalendarDays, ClipboardList, ArrowRight, Info } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.resources.hub.meta.title,
    description: d.resources.hub.meta.description,
  };
}

export default async function ResourcesHubPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const hub = d.resources.hub;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  const sectionIcons = [BookOpen, ClipboardList, CalendarDays];
  const sectionColors = ["navy", "gold", "green"] as const;
  const sectionHrefs = ["/resources/curriculum", "/resources/sol", "/resources/testing"];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            {hub.badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                <GraduationCap className="h-3.5 w-3.5" />
                {hub.badge}
              </span>
            )}
            <h1 className={`mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl${isKo ? " font-ko" : ""}`}>
              {hub.title}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-gold-300">{hub.subtitle}</p>
            <p className={`mx-auto mt-6 max-w-2xl text-base leading-7 text-navy-200${isKo ? " font-ko" : ""}`}>
              {hub.desc}
            </p>
          </div>
        </Container>
      </section>

      {/* Section links */}
      <Section className="bg-navy-50/50">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {hub.sections.map((s, i) => {
              const Icon = sectionIcons[i];
              const color = sectionColors[i];
              return (
                <Link
                  key={s.title}
                  href={lp(sectionHrefs[i])}
                  className="group relative flex flex-col rounded-2xl border border-navy-100 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-navy-300"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={
                        color === "gold"
                          ? "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-white"
                          : color === "green"
                            ? "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white"
                            : "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white"
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-navy-200 px-2.5 py-0.5 text-xs font-semibold text-navy-600">
                      {s.badge}
                    </span>
                  </div>
                  <h2 className={`mt-5 text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {s.title}
                  </h2>
                  {isKo && <p className="text-xs text-navy-500">{s.titleEn}</p>}
                  <p className={`mt-3 flex-1 text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>
                    {s.desc}
                  </p>
                  <div className={`mt-5 flex items-center gap-1 text-sm font-semibold text-navy-900 group-hover:text-navy-600${isKo ? " font-ko" : ""}`}>
                    {s.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Why This Matters */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={hub.why.eyebrow}
            title={hub.why.title}
            titleKo={isKo ? hub.why.titleKo : undefined}
            align="left"
            isKo={isKo}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {hub.why.points.map((p, i) => (
              <div key={p.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className={`mt-4 text-base font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                  {p.title}
                </h3>
                <p className={`mt-2 text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-400/40 bg-amber-50 px-5 py-4 text-sm text-navy-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {hub.why.note}{" "}
              <a
                href="https://www.fcps.edu/elementary/mathematics"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2 hover:text-navy-900"
              >
                {hub.why.noteLink}
              </a>
              {isKo ? "에서 확인하시기 바랍니다." : "."}
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-navy-50/60">
        <Container>
          <SectionHeader
            eyebrow={hub.faq.eyebrow}
            title={hub.faq.title}
            titleKo={isKo ? hub.faq.titleKo : undefined}
            isKo={isKo}
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-navy-100">
            {hub.faq.items.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className={`text-base font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                  Q. {faq.q}
                </h3>
                <p className={`mt-2 text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

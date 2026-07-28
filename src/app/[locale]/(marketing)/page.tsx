import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Sparkles, Clock, Users, BarChart2, BookOpen, Puzzle } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { HeroBackground } from "@/components/site/hero-background";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  const isKo = locale === "ko";
  return {
    description: d.meta.description,
    alternates: pageAlternates(locale, "/"),
    openGraph: {
      locale: isKo ? "ko_KR" : "en_US",
      alternateLocale: isKo ? "en_US" : "ko_KR",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <>
      <LocalBusinessJsonLd />
      <HeroSection d={d.home} lp={lp} isKo={isKo} />
      <Stats d={d.home} isKo={isKo} />
      <ProgramsPreview d={d.home} isKo={isKo} />
      <HowItWorks d={d.home} isKo={isKo} />
      <FinalCTA d={d.home} lp={lp} isKo={isKo} />
    </>
  );
}

function HeroSection({ d, lp, isKo }: { d: Awaited<ReturnType<typeof getDictionary>>["home"]; lp: (p: string) => string; isKo: boolean }) {
  const h = d.hero;
  return (
    <HeroBackground>
      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {h.badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" />
              {h.badge}
            </span>
          )}
          {isKo ? (
            <h1
              className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-ko"
              lang="ko"
            >
              {h.h1line1}
              <br />
              <span className="text-gold-300">{h.h1highlight}</span> {h.h1line2}
            </h1>
          ) : (
            <h1 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {h.h1line1}
              <br />
              <span className="text-gold-300">{h.h1highlight}</span> {h.h1line2}
            </h1>
          )}
          <p className={`mx-auto mt-5 max-w-xl text-lg font-medium text-navy-100 sm:text-xl${isKo ? " font-ko" : ""}`}>
            {h.subtitle}
          </p>
          <p className={`mx-auto mt-4 max-w-xl text-sm leading-6 text-navy-200/70 sm:text-base${isKo ? " font-ko" : ""}`}>
            {h.desc}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={lp("/inquire")}
              size="lg"
              variant="secondary"
              className="min-w-[10rem] border-gold-500 bg-gold-500 text-navy-900 hover:bg-gold-400 hover:border-gold-400"
            >
              {h.ctaInquire}
            </Button>
            <Button href={lp("/programs")} size="lg" variant="secondary" className="min-w-[10rem]">
              {h.ctaPrograms}
            </Button>
          </div>
        </div>
      </Container>
    </HeroBackground>
  );
}

function Stats({ d, isKo }: { d: Awaited<ReturnType<typeof getDictionary>>["home"]; isKo: boolean }) {
  return (
    <Section className="border-y border-navy-100">
      <Container>
        <dl className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-navy-100">
          {d.stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center px-4 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd
                className={
                  s.value === "AAP"
                    ? "text-4xl font-bold tracking-tight text-gold-500 sm:text-5xl"
                    : `text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl${isKo ? " font-ko" : ""}`
                }
              >
                {s.value}
              </dd>
              <p className={`mt-3 text-sm font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>{s.label}</p>
              {s.sublabel && <p className="text-xs text-navy-500">{s.sublabel}</p>}
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

function ProgramsPreview({ d, isKo }: { d: Awaited<ReturnType<typeof getDictionary>>["home"]; isKo: boolean }) {
  const p = d.programs;
  return (
    <Section className="bg-navy-50/60">
      <Container>
        <SectionHeader
          eyebrow={p.eyebrow}
          title={p.title}
          titleKo={p.titleKo || undefined}
          description={p.desc}
          isKo={isKo}
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-100">
            <Image
              src="/hero/student-1.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[p.classSize, p.time].map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-navy-700">
                  {f.label === p.classSize.label ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span className={`text-[11px] font-semibold uppercase tracking-wider text-navy-500${isKo ? " font-ko" : ""}`}>
                    {f.label}
                  </span>
                </div>
                <p className={`mt-2 text-base font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>{f.value}</p>
                {f.sublabel && <p className="text-xs text-navy-600">{f.sublabel}</p>}
              </div>
            ))}
            <div className="col-span-full rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
              <p className={`text-sm font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>{p.schedule}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function HowItWorks({ d, isKo }: { d: Awaited<ReturnType<typeof getDictionary>>["home"]; isKo: boolean }) {
  const icons = [BarChart2, BookOpen, Puzzle];
  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader
          eyebrow={d.how.eyebrow}
          title={d.how.title}
          titleKo={d.how.titleKo || undefined}
          description={d.how.desc}
          isKo={isKo}
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-100">
            <Image
              src="/hero/student-2.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-4">
            {d.how.steps.map((s, i) => {
              const Icon = icons[i];
              return (
                <div key={s.title} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 shrink-0 text-navy-500" />
                  <div>
                    {isKo ? (
                      <h3 className="text-sm font-bold text-navy-900 font-ko" lang="ko">{s.titleKo}</h3>
                    ) : (
                      <h3 className="text-sm font-bold text-navy-900">{s.title}</h3>
                    )}
                    <p className={`mt-1 text-sm text-navy-700${isKo ? " font-ko" : ""}`}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function FinalCTA({ d, lp, isKo }: { d: Awaited<ReturnType<typeof getDictionary>>["home"]; lp: (p: string) => string; isKo: boolean }) {
  const c = d.cta;
  return (
    <Section>
      <Container>
        <div className="rounded-3xl bg-navy-900 px-8 py-14 text-center text-white sm:px-12 sm:py-20">
          {isKo ? (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-ko" lang="ko">
              지금 바로{" "}
              <span className="whitespace-nowrap">
                <span className="border-b-2 border-gold-500 pb-0.5">{c.highlightKo}</span>
                하세요.
              </span>
            </h2>
          ) : (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {c.titleEn} <br className="hidden sm:inline" />
              <span>{c.titleKo}</span>
            </h2>
          )}
          <p className={`mx-auto mt-4 max-w-2xl text-base text-navy-100 sm:text-lg${isKo ? " font-ko" : ""}`}>
            {c.desc.split(". ").map((line, i, arr) => (
              <span key={i}>
                {line}{i < arr.length - 1 ? "." : ""}<br />
              </span>
            ))}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={lp("/inquire")}
              size="lg"
              variant="secondary"
              className="border-gold-500 bg-gold-500 text-navy-900 hover:bg-gold-400 hover:border-gold-400"
            >
              {c.ctaInquire}
            </Button>
            <Button href={lp("/programs")} size="lg" variant="secondary">
              {c.ctaPrograms}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

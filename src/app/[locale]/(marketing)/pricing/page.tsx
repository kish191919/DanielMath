import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipboardCheck, CalendarDays, Users } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.pricing.meta.title,
    description: d.pricing.meta.description,
    alternates: pageAlternates(locale, "/pricing"),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const p = d.pricing;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";
  const icons = [ClipboardCheck, CalendarDays, Users];

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={p.eyebrow}
          title={p.title}
          titleKo={p.titleKo || undefined}
          description={p.desc}
          isKo={isKo}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {p.points.map((point, i) => {
            const Icon = icons[i];
            return (
              <div
                key={point.title}
                className="rounded-2xl border border-navy-100 bg-white p-7 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={`mt-5 text-lg font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                  {point.title}
                </h3>
                <p className={`mt-3 text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button href={lp("/inquire")} size="lg">
            {p.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}

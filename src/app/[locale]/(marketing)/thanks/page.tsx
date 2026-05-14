import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.thanks.meta.title,
    description: d.thanks.meta.description,
    robots: { index: false, follow: false },
  };
}

export default async function ThanksPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const t = d.thanks;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-navy-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy-900">
            {t.title}
          </h1>
          <p className={`mt-2 text-2xl font-semibold text-navy-700${isKo ? " font-ko" : ""}`}>
            {t.subtitle}
          </p>
          <p className={`mt-5 text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {t.body}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href={lp("/")} variant="primary">
              {t.cta1}
            </Button>
            <Link
              href={lp("/programs")}
              className="text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              {t.cta2}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

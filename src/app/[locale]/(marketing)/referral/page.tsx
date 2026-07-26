import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";
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
    title: d.referral.meta.title,
    description: d.referral.meta.description,
    alternates: pageAlternates(locale, "/referral"),
  };
}

export default async function ReferralPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const r = d.referral;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={r.eyebrow}
          title={r.title}
          titleKo={r.titleKo || undefined}
          description={r.desc}
          isKo={isKo}
        />

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h3 className={`mt-5 text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
            {r.howTitle}
          </h3>
          <p className={`mt-3 text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {r.howDesc}
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-400/40 bg-amber-50 px-5 py-4 text-sm text-navy-800">
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>{r.note}</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button href={lp("/inquire")} size="lg">
            {r.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}

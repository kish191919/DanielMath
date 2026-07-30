import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { hasLocale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { privacyPolicy } from "@/lib/legal-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return {
    title: privacyPolicy.title,
    description: privacyPolicy.description,
    alternates: pageAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-bold text-navy-900">{privacyPolicy.title}</h1>
          <p className="mb-10 text-xs text-navy-400">
            Effective: {privacyPolicy.effectiveDate}
          </p>

          <div className="space-y-10">
            {privacyPolicy.body.map((section, i) => (
              <div key={i}>
                <h2 className="mb-3 text-xl font-bold text-navy-900">{section.heading}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((para, j) => (
                    <p key={j} className="leading-relaxed text-navy-700">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

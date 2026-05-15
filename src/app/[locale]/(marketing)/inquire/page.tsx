import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { InquiryForm } from "./inquiry-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.inquire.meta.title,
    description: d.inquire.meta.description,
  };
}

export default async function InquirePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const q = d.inquire;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={q.eyebrow}
          title={q.title}
          titleKo={q.titleKo || undefined}
          description={q.desc}
          isKo={isKo}
        />
        <div className="mx-auto mt-12 max-w-2xl">
          <InquiryForm
            labels={q.form}
            errors={q.errors}
            thanksPath={lp("/thanks")}
          />
        </div>
      </Container>
    </Section>
  );
}

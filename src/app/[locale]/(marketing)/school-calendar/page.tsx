import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SchoolCalendarSection } from "@/components/site/school-calendar-section";
import { Container } from "@/components/site/container";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.schoolCalendar.meta.title,
    description: d.schoolCalendar.meta.description,
  };
}

export default async function SchoolCalendarPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <>
      <div className="border-b border-navy-100 bg-white py-6">
        <Container>
          <Link
            href={lp("/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {isKo ? "홈으로" : "Home"}
          </Link>
          <h1
            className={`mt-3 text-2xl font-bold text-navy-900 sm:text-3xl${isKo ? " font-ko" : ""}`}
            lang={isKo ? "ko" : undefined}
          >
            {isKo ? "학교 캘린더" : "School Calendar"}
          </h1>
        </Container>
      </div>
      <SchoolCalendarSection d={d.schoolCalendar} isKo={isKo} />
    </>
  );
}

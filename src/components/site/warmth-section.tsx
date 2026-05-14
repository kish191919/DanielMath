import Image from "next/image";
import { Container } from "./container";
import type { Locale } from "@/lib/i18n";

type WarmthData = {
  eyebrow: string;
  titleEn: string;
  titleKo: string;
  bodyKo: string;
  bodyEn: string;
};

export function WarmthSection({ locale, d }: { locale: Locale; d: WarmthData }) {
  const isKo = locale === "ko";
  return (
    <section className="bg-navy-50/40 py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl shadow-xl ring-1 ring-navy-100">
            <Image
              src="/warmth/parent-student.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              {d.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Numbers move{" "}
              <span className="border-b-2 border-gold-400 pb-1">when trust does</span>.
            </h2>
            {isKo && (
              <p className="mt-3 text-xl font-semibold text-navy-700 font-ko" lang="ko">
                실력은 <span className="text-navy-900">신뢰</span>가 쌓일 때 움직입니다.
              </p>
            )}
            <p className={`mt-6 text-base leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo ? d.bodyKo : d.bodyEn}
            </p>
            {isKo && (
              <p className="mt-3 text-sm leading-7 text-navy-600">
                {d.bodyEn}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

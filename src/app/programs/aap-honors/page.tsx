import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AAP Honors Track · 3-6",
  description:
    "AAP 합격 후 유지·심화. Common Core 심화 + Above-grade + AMC 8 입문 통합 트랙.",
};

const curriculum = [
  {
    title: "Common Core · Deep Mastery",
    titleKo: "공통핵심 심화",
    items: [
      "Fractions · Decimals · Ratio (분수·비율 정복)",
      "Operations on Multi-digit (다단계 사칙연산)",
      "Geometry · Measurement (각도·면적·부피)",
    ],
  },
  {
    title: "Above-Grade Acceleration",
    titleKo: "한 학년 위 심화",
    items: [
      "Pre-Algebra Foundations (변수·식·방정식)",
      "Number Theory (소인수·배수·약수)",
      "Logical Word Problems (다단계 추론)",
    ],
  },
  {
    title: "AMC 8 & Olympiad Prep",
    titleKo: "AMC 8·경시 준비",
    items: [
      "AMC 8 past papers · 유형별 분석",
      "Math Kangaroo · MOEMS 입문",
      "Counting & Probability, Sequence & Series",
    ],
  },
];

export default function AAPHonorsPage() {
  return (
    <>
      <Section>
        <Container>
          <span className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
            Grade 3 – 6 · AAP Honors
          </span>
          <SectionHeader
            align="left"
            title="AAP Honors Track"
            titleKo="AAP 유지·심화 트랙 · 3-6"
            description="AAP는 들어가는 것보다 유지가 더 까다롭습니다. 학교 수업만으로 부족한 깊이와 속도를, 한 학년 위 콘텐츠와 AMC 8 준비로 만들어갑니다."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {curriculum.map((block) => (
              <div
                key={block.title}
                className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-navy-900">
                  {block.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-navy-700 font-ko" lang="ko">
                  {block.titleKo}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {block.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm text-navy-800">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                      <span className="font-ko" lang="ko">
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* PLACEHOLDER: 실제 운영 정보로 교체하세요. */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <Info label="주당 시수" value="주 2회 / 회당 90~120분 (예시)" />
            <Info label="반 정원" value="최대 6명 소수정예" />
            <Info label="진단" value="입반 전 학년별 진단 시험" />
            <Info label="목표" value="AAP 유지 + AMC 8 honor roll 이상" />
          </div>

          <div className="mt-10 text-center">
            <Button href="/inquire" size="lg">
              자녀 수준 진단 신청
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-navy-50/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
        {label}
      </p>
      <p className="mt-1.5 text-base font-medium text-navy-900 font-ko" lang="ko">
        {value}
      </p>
    </div>
  );
}

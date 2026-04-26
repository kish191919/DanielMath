import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AAP Entry Track · K-2",
  description:
    "K-2 학생을 위한 AAP·CogAT·NNAT 진입 트랙. 추론력·학년 진도·수학 어휘를 균형 있게.",
};

const curriculum = [
  {
    title: "CogAT / NNAT Reasoning",
    titleKo: "추론력 트레이닝",
    items: [
      "Figure Matrix · Figure Series · Paper Folding (도형 회전·전개)",
      "Number Series · Number Analogy (수의 패턴)",
      "Verbal Classification · Sentence Completion (수학 어휘 영어)",
    ],
  },
  {
    title: "Common Core Mastery",
    titleKo: "학년 진도 마스터리",
    items: [
      "Operations & Algebraic Thinking (사칙연산 기초)",
      "Number & Operations in Base Ten (자릿값과 큰 수)",
      "Measurement & Data, Geometry (측정·도형)",
    ],
  },
  {
    title: "Pattern & Spatial Logic",
    titleKo: "패턴·공간 논리",
    items: [
      "Beast Academy 스타일 사고력 문제",
      "Tangram, Tessellation, Mirror Symmetry",
      "Word problem 영어 해석 훈련",
    ],
  },
];

export default function AAPEntryPage() {
  return (
    <>
      <Section>
        <Container>
          <span className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
            Grade K – 2 · AAP Entry
          </span>
          <SectionHeader
            align="left"
            title="AAP Entry Track"
            titleKo="AAP 진입 트랙 · K-2"
            description="2학년 CogAT/NNAT 응시까지의 정확한 로드맵을 함께 그립니다. 단순 시험 대비가 아니라, AAP 환경에서 적응할 수 있는 사고력과 학년 진도를 동시에 다집니다."
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
            <Info label="주당 시수" value="주 2회 / 회당 90분 (예시)" />
            <Info label="반 정원" value="최대 6명 소수정예" />
            <Info label="진단" value="입반 전 무료 진단 (CogAT/NNAT 모의)" />
            <Info label="리포트" value="매일 일일 리포트 + 매월 종합 리포트" />
          </div>

          <div className="mt-10 text-center">
            <Button href="/inquire" size="lg">
              무료 상담 · 진단 신청
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

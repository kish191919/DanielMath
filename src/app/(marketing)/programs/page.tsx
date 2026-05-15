import type { Metadata } from "next";
import { Brain, FileText, LineChart, Sparkles, Clock, Users, CalendarDays } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Program · 프로그램",
  description:
    "3-6학년 학생이 같은 공간에서 학습하지만, 학년·실력에 맞춘 맞춤형 학습지와 숙제가 매 수업 새롭게 제공됩니다.",
};

const pillars = [
  {
    icon: FileText,
    title: "Personalized Worksheets",
    titleKo: "학생별 맞춤 학습지",
    desc: "학년·실력·최근 오답 유형을 반영해 학생마다 다른 학습지가 매 수업 새롭게 생성됩니다. 같은 교실, 다른 진도.",
  },
  {
    icon: Brain,
    title: "AAP-Aligned Curriculum",
    titleKo: "AAP 통합 커리큘럼",
    desc: "Common Core · CogAT/NNAT · Above-grade · AMC 8 을 학생 수준에 맞게 배합. 학교 진도와 영재반·경시까지 한 흐름.",
  },
  {
    icon: Sparkles,
    title: "1:1 Weakness Analysis",
    titleKo: "1:1 약점 분석",
    desc: "오답을 단순 표시하지 않고 계산 실수·개념 부족·문장 해석 등 유형별로 분류해 다음 학습지에 자동 반영.",
  },
  {
    icon: LineChart,
    title: "Daily Parent Report",
    titleKo: "매일 학부모 리포트",
    desc: "그날 학습한 내용·정답률·잘한 영역·약한 영역을 매일 저녁 학부모님께 한국어로 자동 발송.",
  },
];

const coverageChips = [
  { label: "Common Core", labelKo: "학년별 진도" },
  { label: "CogAT / NNAT", labelKo: "AAP 진입 시험" },
  { label: "Above-grade", labelKo: "한 학년 위 심화" },
  { label: "AMC 8 / Olympiad", labelKo: "경시 입문" },
  { label: "Word Problems", labelKo: "서술형 추론" },
  { label: "Pattern Logic", labelKo: "패턴·도형 사고력" },
];

const ops = [
  {
    icon: CalendarDays,
    label: "운영일 / Days",
    value: "월 · 화 · 목 · 금",
    valueEn: "Mon · Tue · Thu · Fri",
  },
  {
    icon: Clock,
    label: "운영시간 / Hours",
    value: "오후 5시 – 8시",
    valueEn: "5:00 PM – 8:00 PM",
  },
  {
    icon: Users,
    label: "정원 / Class Size",
    value: "회당 최대 4명",
    valueEn: "Up to 4 students per session",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Program · 프로그램"
            title="One program. Every student personalized."
            titleKo="하나의 프로그램, 모두 다른 학습지"
            description="3-6학년 학생이 같은 공간에서 모이지만, 학년과 실력에 맞춰 학생마다 다른 학습지와 숙제가 매 수업 새롭게 제공됩니다. 학년 그룹으로 나누지 않고, 각 학생의 진도로 학습합니다."
          />

          {/* 4 pillars */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-navy-100 bg-white p-7 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy-900">{p.title}</h3>
                <p className="mt-1 text-base font-semibold text-navy-700 font-ko" lang="ko">
                  {p.titleKo}
                </p>
                <p className="mt-3 text-sm leading-7 text-navy-700 font-ko" lang="ko">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Curriculum coverage */}
      <Section className="bg-navy-50/60">
        <Container>
          <SectionHeader
            eyebrow="Curriculum"
            title="What we cover, blended per student."
            titleKo="학생마다 비율이 다른 통합 커리큘럼"
            description="아래 영역들을 학생의 학년과 목표에 맞춰 매주 비율을 조정해 학습지에 반영합니다."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {coverageChips.map((c) => (
              <div
                key={c.label}
                className="flex items-baseline gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                <span className="font-semibold text-navy-900">{c.label}</span>
                <span className="text-xs text-navy-600 font-ko" lang="ko">
                  {c.labelKo}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Operations */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Schedule · 운영 안내"
            title="Simple, focused."
            titleKo="간결하고 집중된 운영"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {ops.map((o) => (
              <div
                key={o.label}
                className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                    {o.label}
                  </p>
                </div>
                <p className="mt-4 text-lg font-semibold text-navy-900 font-ko" lang="ko">
                  {o.value}
                </p>
                <p className="mt-0.5 text-sm text-navy-600">{o.valueEn}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-navy-700 font-ko" lang="ko">
            학생당 <strong className="text-navy-900">주 1회 · 60분</strong> 수업.
            월·화·목·금 오후 5시 ~ 8시 사이에서 학생별 시간을 등록 시 배정합니다.
          </p>

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

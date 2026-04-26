import type { Metadata } from "next";
import { Check, CalendarDays, Clock, Users } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tuition · 수업료",
  description:
    "Daniel Math 공부방 수업료 안내. 월 $50, 모든 학년 K-6 동일. 주 1회 60분.",
};

const includes = [
  { en: "Personalized worksheets every session", ko: "학생별 맞춤 학습지 (매 수업)" },
  { en: "Personalized homework", ko: "학생별 맞춤 숙제" },
  { en: "AI-powered grading & error analysis", ko: "AI 자동 채점·오답 유형 분석" },
  { en: "Daily report to parents (Korean)", ko: "매일 한국어 학부모 리포트" },
  { en: "Monthly progress summary", ko: "월별 종합 학습 리포트" },
  { en: "No enrollment fee, no textbook fee", ko: "등록비·교재비 별도 없음" },
];

export default function TuitionPage() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Tuition · 수업료"
          title="One simple price. All K-6."
          titleKo="모든 학년 동일한 단일 요금"
          description="학년·실력에 따라 학습 내용은 학생마다 다르지만, 수업료는 모두 같습니다."
        />

        {/* Single-tier pricing card */}
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="rounded-3xl border border-navy-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="text-center">
              <span className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-700">
                Grade K – 6 · All Levels
              </span>
              <div className="mt-6 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold tracking-tight text-navy-900">
                  $50
                </span>
                <span className="text-lg font-medium text-navy-600">/ month</span>
              </div>
              <p className="mt-2 text-base font-semibold text-navy-700 font-ko" lang="ko">
                월 50불 · 모든 학년 동일
              </p>
            </div>

            <div className="my-8 grid gap-4 border-y border-navy-100 py-7 sm:grid-cols-3">
              <Spec
                icon={CalendarDays}
                label="운영일"
                value="월 · 화 · 목 · 금"
                valueEn="Mon · Tue · Thu · Fri"
              />
              <Spec
                icon={Clock}
                label="시간"
                value="주 1회 · 60분"
                valueEn="1 × 60 min / week"
              />
              <Spec
                icon={Users}
                label="정원"
                value="회당 최대 4명"
                valueEn="Max 4 / session"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-500">
                Included / 포함 사항
              </h3>
              <ul className="mt-4 space-y-2.5">
                {includes.map((it) => (
                  <li key={it.en} className="flex gap-2.5 text-sm text-navy-800">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                    <span>
                      <span className="font-medium">{it.en}</span>
                      <span className="ml-2 text-navy-600 font-ko" lang="ko">
                        / {it.ko}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-xl border border-navy-100 bg-navy-50/60 p-4 text-sm text-navy-700 font-ko" lang="ko">
              <strong className="text-navy-900">시간 배정 안내:</strong>{" "}
              매주 월·화·목·금 오후 5시 ~ 8시 사이에서 학생별로 60분 시간을
              등록 시 배정해드립니다.
            </div>

            <div className="mt-8">
              <Button href="/inquire" size="lg" className="w-full">
                무료 상담 · 진단 신청
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
  valueEn,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueEn: string;
}) {
  return (
    <div className="text-center">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-navy-500 font-ko" lang="ko">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-navy-900 font-ko" lang="ko">
        {value}
      </p>
      <p className="text-xs text-navy-600">{valueEn}</p>
    </div>
  );
}

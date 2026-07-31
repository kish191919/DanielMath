import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Type, Shapes, Hash, Gauge, Users, CheckCircle, Info, BookOpen, GraduationCap } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const alt = pageAlternates(locale, "/resources/testing/ngat");
  return locale === "ko"
    ? {
        title: "NGAT(AAP 역량 검사)란? 학부모 가이드",
        description: "FCPS AAP 배치에 쓰이는 NGAT 시험의 구조, 채점, 일정, 예시 문제까지 — 학부모를 위한 완전 가이드.",
        alternates: alt,
      }
    : {
        title: "What Is the NGAT? A Parent's Guide",
        description: "Structure, scoring, timing, and sample questions — everything parents need to know about the NGAT, FCPS's AAP ability test.",
        alternates: alt,
      };
}

const keyFacts = [
  {
    icon: Brain,
    value: "3",
    label: "Sections",
    labelKo: "검사 영역 수",
    desc: "Verbal, Nonverbal, and Quantitative reasoning — no outside curriculum content is tested.",
    descKo: "언어(Verbal)·비언어(Nonverbal)·수량(Quantitative) 세 영역으로 구성되며, 학교 교과 지식이 아닌 추론 능력을 측정합니다.",
  },
  {
    icon: Users,
    value: "Gr. 2–7",
    label: "Eligible Grades",
    labelKo: "응시 가능 학년",
    desc: "All 2nd graders are screened automatically; grades 2–7 may be screened through a parent or teacher referral.",
    descKo: "2학년 전원은 자동으로 스크리닝을 받으며, 2~7학년은 학부모·교사 추천을 통해 검사를 받을 수 있습니다.",
  },
  {
    icon: Gauge,
    value: "Top 3–5%",
    label: "Full-Time AAP Range",
    labelKo: "풀타임 AAP 기준 점수대",
    desc: "Roughly the top 3–5% of scores is typical for Full-Time (Level IV) AAP, alongside portfolio evidence.",
    descKo: "풀타임(Level IV) AAP는 일반적으로 상위 3~5% 수준의 점수와 함께 포트폴리오 자료를 종합적으로 검토합니다.",
  },
];

const timelineRows = [
  {
    stage: "Universal 2nd-Grade Screening",
    stageKo: "2학년 전체 스크리닝",
    when: "Fall, every year",
    whenKo: "매년 가을",
    detail: "All 2nd graders take the NGAT automatically — no referral needed.",
    detailKo: "2학년 학생 전원이 자동으로 NGAT를 치르며, 별도 신청이 필요하지 않습니다.",
  },
  {
    stage: "Referral Window (Grades 2–7)",
    stageKo: "추천서 접수 기간 (2~7학년)",
    when: "Mid-Aug – Mid-Dec",
    whenKo: "8월 중순 ~ 12월 중순",
    detail: "Parents or teachers submit a referral to the school's AART for students outside the automatic 2nd-grade screening.",
    detailKo: "2학년 자동 스크리닝 대상이 아닌 학생은 학부모나 교사가 학교의 AART에게 추천서를 제출해야 합니다.",
  },
  {
    stage: "Testing Administered",
    stageKo: "검사 시행",
    when: "Jan – Feb",
    whenKo: "1월 ~ 2월",
    detail: "The NGAT is administered at school for all screened students.",
    detailKo: "스크리닝 대상 학생 전원을 대상으로 학교에서 NGAT 검사가 시행됩니다.",
  },
  {
    stage: "Results & Portfolio Review",
    stageKo: "결과 통보 & 포트폴리오 검토",
    when: "Feb – Mar",
    whenKo: "2월 ~ 3월",
    detail: "Parents receive results; eligible students proceed to a Portfolio Review of grades and teacher evaluations.",
    detailKo: "학부모에게 결과가 통보되며, 해당 학생은 성적·교사 평가 등을 종합하는 포트폴리오 검토 단계로 넘어갑니다.",
  },
  {
    stage: "Final Placement Notification",
    stageKo: "최종 배치 통보",
    when: "Apr",
    whenKo: "4월",
    detail: "FCPS mails placement letters; Full-Time AAP begins the following school year at a designated center school.",
    detailKo: "FCPS가 배치 결과 서한을 발송하며, 풀타임 AAP는 다음 학년도부터 지정 센터 학교에서 시작됩니다.",
  },
];

const sectionsExplained = [
  {
    icon: Type,
    name: "Verbal",
    nameKo: "Verbal (언어)",
    desc: "Presents six pictures; the student identifies the concept shared by five of them. Uses images instead of written or spoken language, so it's designed to be fair across language backgrounds.",
    descKo: "여섯 개의 그림 중 다섯 개가 공유하는 개념을 찾는 방식입니다. 문장이 아닌 그림으로 제시되어 언어 배경에 관계없이 공정하게 평가할 수 있도록 설계되었습니다.",
  },
  {
    icon: Shapes,
    name: "Nonverbal",
    nameKo: "Nonverbal (비언어)",
    desc: "Measures logical reasoning through shapes, colors, sequence, and orientation — typically presented as matrix-style visual patterns.",
    descKo: "도형, 색상, 순서, 방향 등 시각적 패턴 사이의 논리적 관계를 파악하는 능력을 측정하며, 보통 행렬(매트릭스) 형태의 문제로 제시됩니다.",
  },
  {
    icon: Hash,
    name: "Quantitative",
    nameKo: "Quantitative (수량)",
    desc: "Evaluates relationships between numbers and symbols — how a student thinks mathematically, not computational speed.",
    descKo: "숫자와 기호 사이의 관계를 다루며, 단순 연산 속도가 아니라 수학적으로 사고하는 방식을 평가합니다.",
  },
];

const scoringPoints = [
  {
    en: "Results are reported as a Naglieri Ability Index (NAI) and a Percentile Rank, not a raw score.",
    ko: "결과는 원점수가 아니라 NAI(Naglieri Ability Index)와 백분위(Percentile Rank)로 제공됩니다.",
  },
  {
    en: "The NAI compares a student to same-age peers, with an average of 100 — most students score between 85 and 115.",
    ko: "NAI는 동일 연령대 학생과 비교한 점수로, 평균은 100이며 대다수 학생은 85~115 사이에 분포합니다.",
  },
  {
    en: "A 99th percentile means a student scored higher than 99 out of 100 same-age peers.",
    ko: "백분위 99는 동일 연령대 100명 중 99명보다 높은 점수를 받았다는 의미입니다.",
  },
  {
    en: "Full-Time AAP (Level IV) placement typically requires scores in roughly the top 3–5%, but scores are never the sole factor — teacher evaluations and academic performance are also weighed through Portfolio Review.",
    ko: "풀타임 AAP(Level IV) 배치는 일반적으로 상위 3~5% 이내의 점수가 필요하지만, 점수만으로 결정되지 않으며 포트폴리오 검토를 통해 교사 평가와 학업 성취도도 함께 반영됩니다.",
  },
  {
    en: "FCPS still accepts privately administered CogAT, NNAT-3, or WISC-V scores as alternative evidence.",
    ko: "FCPS는 개별적으로 응시한 CogAT·NNAT-3 또는 WISC-V 점수도 대안 자료로 계속 인정합니다.",
  },
];

const sampleQuestions = [
  {
    key: "verbal",
    section: "Verbal",
    sectionKo: "Verbal (언어)",
    icon: Type,
    promptEn: "Look at these five words: apple, banana, grape, chair, orange. Four of them share something in common — which one does NOT belong?",
    promptKo: "다음 다섯 개의 단어를 보세요: 사과, 바나나, 포도, 의자, 오렌지. 이 중 네 개는 공통점이 있습니다 — 어울리지 않는 하나는 무엇일까요?",
    choicesEn: ["A. Apple", "B. Banana", "C. Chair", "D. Orange"],
    choicesKo: ["A. 사과", "B. 바나나", "C. 의자", "D. 오렌지"],
    answerEn:
      "C — Chair. The other four are all fruits; a chair is a piece of furniture and shares no conceptual category with them. (On the real NGAT, this concept is shown using pictures rather than written words.)",
    answerKo:
      "정답: C — 의자. 나머지 네 개는 모두 과일이며, 의자는 가구로 다른 것들과 공통 개념이 없습니다. (실제 NGAT에서는 단어가 아니라 그림으로 이런 개념을 제시합니다.)",
  },
  {
    key: "nonverbal",
    section: "Nonverbal",
    sectionKo: "Nonverbal (비언어)",
    icon: Shapes,
    promptEn:
      "Picture a 2×2 grid of shapes. Top-left: a small light-gray square. Top-right: a medium gray square. Bottom-left: a medium gray square, rotated 90°. Bottom-right: a blank box — what belongs there, following the same pattern of size and rotation?",
    promptKo:
      "2×2 칸의 도형을 떠올려 보세요. 왼쪽 위: 작은 연회색 정사각형. 오른쪽 위: 중간 크기의 회색 정사각형. 왼쪽 아래: 중간 크기의 회색 정사각형을 90도 회전한 모양. 오른쪽 아래는 빈 칸입니다 — 크기와 회전의 규칙을 따른다면 무엇이 들어가야 할까요?",
    choicesEn: [
      "A. A large dark-gray square, rotated 90°",
      "B. A small light-gray square, not rotated",
      "C. A medium gray circle",
      "D. A medium gray square, not rotated",
    ],
    choicesKo: [
      "A. 큰 진회색 정사각형, 90도 회전",
      "B. 작은 연회색 정사각형, 회전 없음",
      "C. 중간 크기의 회색 원",
      "D. 중간 크기의 회색 정사각형, 회전 없음",
    ],
    answerEn:
      "A — Moving left to right and top to bottom, the shape grows one size larger, darkens one shade, and rotates 90° each step. The bottom-right shape should continue both trends: larger, darker, and rotated.",
    answerKo:
      "정답: A — 왼쪽에서 오른쪽, 위에서 아래로 갈수록 도형은 한 단계씩 커지고, 한 단계 더 진해지며, 90도씩 회전합니다. 오른쪽 아래 칸도 이 두 가지 규칙(크기·회전)을 그대로 이어가야 합니다.",
  },
  {
    key: "quantitative",
    section: "Quantitative",
    sectionKo: "Quantitative (수량)",
    icon: Hash,
    promptEn: "If ● + ● + ▲ = 12, and ▲ = 4, what does ● + ▲ equal?",
    promptKo: "● + ● + ▲ = 12 이고 ▲ = 4일 때, ● + ▲의 값은 얼마일까요?",
    choicesEn: ["A. 6", "B. 8", "C. 10", "D. 12"],
    choicesKo: ["A. 6", "B. 8", "C. 10", "D. 12"],
    answerEn: "B — 8. Since ▲ = 4, then ● + ● = 8, so ● = 4. Then ● + ▲ = 4 + 4 = 8.",
    answerKo: "정답: B — 8. ▲ = 4이므로 ● + ● = 8, 즉 ● = 4입니다. 따라서 ● + ▲ = 4 + 4 = 8입니다.",
  },
];

export default async function NgatPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <>
      {/* Header */}
      <section className="border-b border-navy-100 bg-white py-12 sm:py-16">
        <Container>
          <Link
            href={lp("/resources/testing")}
            className={`inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-4 py-1.5 text-sm font-medium text-navy-600 shadow-sm transition hover:border-navy-400 hover:text-navy-900 hover:shadow${isKo ? " font-ko" : ""}`}
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {isKo ? "시험 & 대회 일정으로 돌아가기" : "Back to Test Calendar"}
          </Link>
          <div className="mt-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-white">
              <Brain className="h-8 w-8" />
            </div>
            <h1 className={`mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl${isKo ? " font-ko" : ""}`}>
              {isKo ? "NGAT란 무엇인가요?" : "What Is the NGAT?"}
            </h1>
            <p className="mt-1 text-sm text-navy-500">Naglieri General Ability Test</p>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "시험 소개" : "About the Test"}
            title={isKo ? "능력과 사고력을 측정하는 검사" : "A Test of Reasoning, Not Curriculum"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl space-y-4">
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "FCPS는 2025-2026학년도부터 AAP(심화학급) 선발을 위한 능력검사 체계를 바꿨습니다. 과거에는 2학년 전체 학생에게 CogAT를, 1학년 전체 학생에게 NNAT를 각각 실시했지만, 현재는 이 두 시험을 대체하는 단일 검사인 NGAT를 2~7학년 스크리닝에 활용합니다."
                : "Starting with the 2025-2026 school year, FCPS changed the ability-testing system used for AAP (Advanced Academic Programs) screening. Previously, all 2nd graders took the CogAT and all 1st graders took the NNAT. Both have now been replaced by a single test, the NGAT, used for screening in grades 2–7."}
            </p>
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "NGAT는 NNAT를 개발한 심리학자 Jack Naglieri가 만든 검사로, 학생이 배운 지식이 아니라 추론 능력과 문제 해결 잠재력을 측정합니다. Verbal·Nonverbal·Quantitative 세 영역으로 구성되어 있습니다."
                : "The NGAT was developed by Jack Naglieri, the same psychologist behind the NNAT, and measures reasoning ability and problem-solving potential rather than learned content. It's organized into three sections — Verbal, Nonverbal, and Quantitative."}
            </p>
          </div>
        </Container>
      </Section>

      {/* Key facts */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "핵심 정보" : "Key Facts"}
            title={isKo ? "한눈에 보는 NGAT" : "NGAT at a Glance"}
            isKo={isKo}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {keyFacts.map((s) => (
              <div key={s.label} className="rounded-2xl border border-gold-300 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-2xl font-bold text-navy-900">{s.value}</p>
                <p className={`text-xs font-semibold text-navy-600${isKo ? " font-ko" : ""}`}>
                  {isKo ? s.labelKo : s.label}
                </p>
                <p className={`mt-2 text-xs leading-5 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {isKo ? s.descKo : s.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline / administration */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "시험 일정" : "Timeline"}
            title={isKo ? "선발 절차 한눈에 보기" : "The Full Screening & Placement Timeline"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-3xl overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm touch-pan-x">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-100 bg-navy-50">
                <tr>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "단계" : "Stage"}
                  </th>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "시기" : "Timing"}
                  </th>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "내용" : "Detail"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {timelineRows.map((r) => (
                  <tr key={r.stage} className="hover:bg-navy-50/40">
                    <td className={`px-5 py-4 font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                      {isKo ? r.stageKo : r.stage}
                    </td>
                    <td className={`px-5 py-4 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? r.whenKo : r.when}</td>
                    <td className={`px-5 py-4 text-navy-700${isKo ? " font-ko" : ""}`}>
                      {isKo ? r.detailKo : r.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-navy-200 bg-white px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {isKo ? (
                <>
                  정확한 날짜는 학년도·학교마다 조금씩 달라질 수 있으니, 재학 중인 학교의 AART(Advanced Academic Resource
                  Teacher)나{" "}
                  <a
                    href="https://www.fcps.edu/academics/academic-overview/advanced-academics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    FCPS AAP 공식 페이지
                  </a>
                  에서 확인하세요.
                </>
              ) : (
                <>
                  Exact dates can shift slightly year to year — check with your school&apos;s AART (Advanced Academic
                  Resource Teacher) or the{" "}
                  <a
                    href="https://www.fcps.edu/academics/academic-overview/advanced-academics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    official FCPS AAP page
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </Container>
      </Section>

      {/* Three sections explained */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "세 가지 영역" : "Three Sections"}
            title="Verbal · Nonverbal · Quantitative"
            isKo={isKo}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {sectionsExplained.map((s) => (
              <div key={s.name} className="rounded-2xl border border-gold-300 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className={`mt-3 text-sm font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                  {isKo ? s.nameKo : s.name}
                </p>
                <p className={`mt-2 text-xs leading-5 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {isKo ? s.descKo : s.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Scoring */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "채점 방식" : "Scoring"}
            title={isKo ? "NAI와 백분위, 어떻게 읽나요?" : "Reading the NAI and Percentile"}
            isKo={isKo}
          />
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {scoringPoints.map((s) => (
              <li key={s.en} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm shadow-sm">
                <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                <span className={`leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? s.ko : s.en}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Sample questions */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "직접 풀어보기" : "Try It Yourself"}
            title={isKo ? "예시 문제로 형식 익히기" : "Sample Questions by Format"}
            isKo={isKo}
          />
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-gold-400/60 bg-amber-50 px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "아래 예시 문제는 각 영역의 형식을 이해하기 쉽도록 Daniel Math Academy가 직접 만든 것이며, 실제 NGAT 시험에 출제된 문제나 유출된 문제가 아닙니다. NGAT는 보안이 유지되는 저작권 보호 검사로, 공식적으로 공개된 기출문제가 존재하지 않습니다."
                : "These are original, illustrative example questions written by Daniel Math Academy to help families understand each section's format. They are not real, leaked, or official NGAT test questions — the NGAT is a secure, copyrighted assessment, and no legitimate publicly available past-exam questions exist for it."}
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl space-y-5">
            {sampleQuestions.map((q) => (
              <div key={q.key} className="rounded-2xl border border-gold-300 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-white">
                    <q.icon className="h-4 w-4" />
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-wider text-navy-500${isKo ? " font-ko" : ""}`}>
                    {isKo ? q.sectionKo : q.section}
                  </p>
                </div>
                <p className={`mt-4 text-sm leading-7 text-navy-900${isKo ? " font-ko" : ""}`}>
                  {isKo ? q.promptKo : q.promptEn}
                </p>
                <ul className="mt-3 space-y-1">
                  {(isKo ? q.choicesKo : q.choicesEn).map((c) => (
                    <li key={c} className={`text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-start gap-2 border-t border-navy-100 pt-4">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <p className={`text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>
                    {isKo ? q.answerKo : q.answerEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How to prepare + cross-link */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "준비 방법" : "How to Prepare"}
            title={isKo ? "추론력은 벼락치기로 만들어지지 않습니다" : "Reasoning Skills Aren't Built Overnight"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
              <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                {isKo
                  ? "NGAT는 교과 내용보다 추론 능력을 측정하기 때문에, 단순 암기나 공식 학습만으로는 준비가 어렵습니다. 가장 효과적인 준비는 Verbal·Nonverbal·Quantitative 세 영역의 문제 형식에 미리 익숙해지는 것입니다. 특히 Quantitative 영역은 Singapore Math나 Beast Academy처럼 개념 중심의 사고력 수학을 훈련하면 실질적인 도움이 됩니다."
                  : "Since the NGAT measures reasoning rather than curriculum knowledge, memorization and formula drills are ineffective. The most practical preparation is familiarizing your child with all three question formats — Verbal, Nonverbal, and Quantitative. For the Quantitative section specifically, building conceptual math thinking through programs like Singapore Math or Beast Academy provides genuine, lasting preparation."}
              </p>
            </div>
            <div className="mt-6">
              <Link
                href={lp("/blog/cogat-nnat-guide")}
                className={`inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-navy-50 px-5 py-2.5 text-sm font-semibold text-navy-800 shadow-sm hover:bg-navy-100${isKo ? " font-ko" : ""}`}
              >
                <GraduationCap className="h-4 w-4" />
                {isKo ? "NGAT 완전 가이드 더 읽어보기" : "Read the Full NGAT Guide"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-navy-50/50">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className={`text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "NGAT 준비, Daniel Math Academy와 함께하세요" : "Prepare for the NGAT with Daniel Math Academy"}
            </h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "아이의 수준에 맞춰 Verbal·Nonverbal·Quantitative 세 영역의 추론력을 키우는 준비를 도와드립니다."
                : "We help students build reasoning skills across the Verbal, Nonverbal, and Quantitative sections, tailored to their level."}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={lp("/inquire")}
                className={`inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700${isKo ? " font-ko" : ""}`}
              >
                {isKo ? "무료 상담 신청" : "Schedule a Free Consult"}
              </Link>
              <Link
                href={lp("/resources/testing")}
                className={`inline-flex items-center gap-2 rounded-xl border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50${isKo ? " font-ko" : ""}`}
              >
                {isKo ? "다른 시험 보기" : "Other Tests & Competitions"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

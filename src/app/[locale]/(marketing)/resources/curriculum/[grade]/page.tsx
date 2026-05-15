import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { grades, gradeBySlug, type GradeData, type TrackData } from "@/lib/curriculum-data";
import { gradeEquivalentEn, highlightsEn } from "@/lib/curriculum-data-en";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; grade: string }> };

export function generateStaticParams() {
  return grades.flatMap((g) => [
    { locale: "ko", grade: g.slug },
    { locale: "en", grade: g.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, grade: slug } = await params;
  if (!hasLocale(locale)) return {};
  const g = gradeBySlug[slug];
  if (!g) return {};
  return locale === "ko"
    ? { title: `${g.gradeKo} 수학 커리큘럼`, description: `FCPS ${g.gradeKo} 일반·심화(AAP) 수학 분기별 학습 내용 비교.` }
    : { title: `${g.grade} Math Curriculum — FCPS`, description: `FCPS ${g.grade} Standard and Advanced (AAP) math — quarter-by-quarter comparison.` };
}

export default async function GradePage({ params }: Props) {
  const { locale, grade: slug } = await params;
  if (!hasLocale(locale)) notFound();
  const g = gradeBySlug[slug];
  if (!g) notFound();

  const sorted = [...grades].sort((a, b) => a.gradeNum - b.gradeNum);
  const idx = sorted.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  const enData = gradeEquivalentEn[slug];
  const enHighlights = highlightsEn[slug];

  return (
    <>
      <GradeHeader g={g} prev={prev} next={next} lp={lp} isKo={isKo} />
      <ComparisonSection g={g} isKo={isKo} enData={enData} enHighlights={enHighlights} />
      <HighlightSection g={g} lp={lp} isKo={isKo} enData={enData} />
      {(g.fcpsUrlStandard || g.fcpsUrlAdvanced) && <FcpsLinks g={g} isKo={isKo} />}
    </>
  );
}

function GradeHeader({
  g, prev, next, lp, isKo,
}: {
  g: GradeData; prev: GradeData | null; next: GradeData | null;
  lp: (p: string) => string; isKo: boolean;
}) {
  return (
    <section className="border-b border-navy-100 bg-white py-12 sm:py-16">
      <Container>
        <div className="flex items-center justify-between">
          <Link
            href={lp("/resources/curriculum")}
            className={`flex items-center gap-1 text-sm text-navy-500 hover:text-navy-800${isKo ? " font-ko" : ""}`}
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "커리큘럼 목록" : "Curriculum List"}
          </Link>
          <div className="flex items-center gap-2">
            {prev && (
              <Link
                href={lp(`/resources/curriculum/${prev.slug}`)}
                className="flex items-center gap-1 rounded-lg border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {prev.gradeNum === 0 ? "K" : `${isKo ? prev.gradeNum + "학년" : "Gr " + prev.gradeNum}`}
              </Link>
            )}
            {next && (
              <Link
                href={lp(`/resources/curriculum/${next.slug}`)}
                className="flex items-center gap-1 rounded-lg border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-50"
              >
                {next.gradeNum === 0 ? "K" : `${isKo ? next.gradeNum + "학년" : "Gr " + next.gradeNum}`}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-3xl font-bold text-white">
            {g.gradeNum === 0 ? "K" : g.gradeNum}
          </div>
          <h1 className={`mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl${isKo ? " font-ko" : ""}`}>
            {isKo ? g.gradeKo : g.grade}
          </h1>
          <p className="mt-1 text-sm text-navy-500">{g.grade} Math Curriculum · FCPS</p>
        </div>
      </Container>
    </section>
  );
}

function ComparisonSection({
  g, isKo, enData, enHighlights,
}: {
  g: GradeData; isKo: boolean;
  enData: { standard: string; advanced: string } | undefined;
  enHighlights: { standard: string[]; advanced: string[] } | undefined;
}) {
  const qLabels = isKo
    ? { Q1: "1분기 (9~11월)", Q2: "2분기 (12~2월)", Q3: "3분기 (2~4월)", Q4: "4분기 (4~6월)" }
    : { Q1: "Q1 (Sep–Nov)", Q2: "Q2 (Dec–Feb)", Q3: "Q3 (Feb–Apr)", Q4: "Q4 (Apr–Jun)" };

  return (
    <Section>
      <Container>
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            {isKo ? "분기별 학습 내용 비교" : "Quarter-by-Quarter Comparison"}
          </p>
          <h2 className={`mt-1 text-2xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
            {isKo ? "일반 수학 vs 심화 수학 (AAP)" : "Standard Math vs. Advanced Math (AAP)"}
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <TrackHeader
            track={g.standard}
            level="standard"
            isKo={isKo}
            gradeEqEn={enData?.standard}
            highlightsEn={enHighlights?.standard}
          />
          <TrackHeader
            track={g.advanced}
            level="advanced"
            isKo={isKo}
            gradeEqEn={enData?.advanced}
            highlightsEn={enHighlights?.advanced}
          />
        </div>

        <div className="mt-4 space-y-4">
          {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => {
            const sq = g.standard.quarters.find((x) => x.quarter === q);
            const aq = g.advanced.quarters.find((x) => x.quarter === q);
            return (
              <div key={q} className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-navy-900 px-2 py-0.5 text-xs font-bold text-white">{q}</span>
                    <span className="text-xs text-navy-500">{qLabels[q]}</span>
                    {sq?.focusKo && isKo && (
                      <span className="ml-auto text-xs font-semibold text-navy-700 font-ko">{sq.focusKo}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {sq?.topics.map((t) => (
                      <li key={t.en} className="flex items-start gap-2 text-sm text-navy-800">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
                        <span className={isKo ? "font-ko" : ""}>{isKo ? t.ko : t.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-gold-300/60 bg-amber-50/60 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-gold-500 px-2 py-0.5 text-xs font-bold text-white">{q}</span>
                    <span className="text-xs text-navy-500">{qLabels[q]}</span>
                    {aq?.focusKo && isKo && (
                      <span className="ml-auto text-xs font-semibold text-navy-700 font-ko">{aq.focusKo}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {aq?.topics.map((t) => (
                      <li key={t.en} className="flex items-start gap-2 text-sm text-navy-800">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                        <span className={isKo ? "font-ko" : ""}>{isKo ? t.ko : t.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function TrackHeader({
  track, level, isKo, gradeEqEn, highlightsEn: hlEn,
}: {
  track: TrackData; level: "standard" | "advanced"; isKo: boolean;
  gradeEqEn: string | undefined; highlightsEn: string[] | undefined;
}) {
  const isAdvanced = level === "advanced";
  const gradeEq = isKo ? track.gradeEquivalentKo : (gradeEqEn ?? track.gradeEquivalentKo);
  const hl = isKo ? track.highlights : (hlEn ?? track.highlights);

  return (
    <div className={isAdvanced ? "rounded-2xl border border-gold-400/60 bg-amber-50 p-5" : "rounded-2xl border border-navy-200 bg-navy-50/60 p-5"}>
      <div className="flex items-center gap-2">
        {isAdvanced ? (
          <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {isKo ? "AAP 심화" : "AAP Advanced"}
          </span>
        ) : (
          <span className="rounded-full bg-navy-700 px-2.5 py-0.5 text-xs font-bold text-white">
            {isKo ? "일반" : "Standard"}
          </span>
        )}
        <span className="text-xs text-navy-600">{gradeEq}</span>
      </div>
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {hl.map((h) => (
          <li key={h} className="flex items-start gap-1.5 text-xs text-navy-800">
            <CheckCircle className={isAdvanced ? "mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" : "mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-500"} />
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HighlightSection({
  g, lp, isKo, enData,
}: {
  g: GradeData; lp: (p: string) => string; isKo: boolean;
  enData: { standard: string; advanced: string } | undefined;
}) {
  const isTopGrade = g.gradeNum >= 5;
  const stdEq = isKo ? g.standard.gradeEquivalentKo : (enData?.standard ?? g.standard.gradeEquivalentKo);
  const advEq = isKo ? g.advanced.gradeEquivalentKo : (enData?.advanced ?? g.advanced.gradeEquivalentKo);

  return (
    <Section className="bg-navy-50/60">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
          <h2 className={`text-lg font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
            {isKo ? "학부모가 알면 좋은 포인트" : "Key Points for Parents"}
          </h2>
          <div className={`mt-5 space-y-4 text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {isKo ? (
              <>
                <p>
                  <strong className="text-navy-900">심화반(AAP)이라면</strong> — {advEq} 내용을 배웁니다.
                  일반반 친구들보다 한 학년 높은 SOL 내용을 학습하므로, 보다 추상적인 사고와 문제 해결 능력이 요구됩니다.
                </p>
                <p>
                  <strong className="text-navy-900">일반반이라면</strong> — {stdEq} SOL 기준을 충실히 이수합니다.
                  학년 말 SOL 시험 준비가 중요하며, 필요에 따라 다음 학년 AAP 배치를 목표로 준비할 수 있습니다.
                </p>
                {isTopGrade && (
                  <p>
                    <strong className="text-navy-900">중학교 진입 전략</strong> — 심화반 5~6학년을 마친 학생은 중학교에서
                    Algebra I를 조기 이수할 수 있어, 고등학교 AP Calculus AB/BC까지의 경로가 열립니다.
                    Daniel Math Academy는 이 진입 준비를 전문적으로 지원합니다.
                  </p>
                )}
              </>
            ) : (
              <>
                <p>
                  <strong className="text-navy-900">If your child is in Advanced (AAP)</strong> — they are covering {advEq} content.
                  They&apos;re learning material one grade above their peers, which requires more abstract thinking and problem-solving.
                </p>
                <p>
                  <strong className="text-navy-900">If your child is in Standard</strong> — they are completing {stdEq} SOL standards.
                  End-of-year SOL test preparation is important, and if desired, you can work toward AAP placement next year.
                </p>
                {isTopGrade && (
                  <p>
                    <strong className="text-navy-900">Middle School Strategy</strong> — Students who finish Advanced 5th–6th grade can access Algebra I early in middle school,
                    opening the path to AP Calculus AB/BC in high school.
                    Daniel Math Academy specializes in preparing students for this transition.
                  </p>
                )}
              </>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={lp("/inquire")}
              className={`inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700${isKo ? " font-ko" : ""}`}
            >
              {isKo ? "맞춤 상담 신청 →" : "Schedule a Consult →"}
            </Link>
            <Link
              href={lp("/resources/curriculum")}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50${isKo ? " font-ko" : ""}`}
            >
              {isKo ? "다른 학년 보기" : "Other Grades"}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function FcpsLinks({ g, isKo }: { g: GradeData; isKo: boolean }) {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl">
          <h2 className={`text-base font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
            {isKo ? "FCPS 공식 Year at a Glance 자료" : "FCPS Official Year at a Glance"}
          </h2>
          <p className={`mt-1 text-sm text-navy-600${isKo ? " font-ko" : ""}`}>
            {isKo ? "더 상세한 내용은 FCPS 공식 페이지에서 확인하세요." : "For more detailed content, visit the FCPS official page."}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {g.fcpsUrlStandard && (
              <a
                href={g.fcpsUrlStandard}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50"
              >
                <ExternalLink className="h-4 w-4" />
                {isKo ? "일반 수학 (FCPS)" : "Standard Math (FCPS)"}
              </a>
            )}
            {g.fcpsUrlAdvanced && (
              <a
                href={g.fcpsUrlAdvanced}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gold-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-navy-700 hover:bg-amber-100"
              >
                <ExternalLink className="h-4 w-4 text-gold-600" />
                {isKo ? "심화 수학 (FCPS)" : "Advanced Math (FCPS)"}
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

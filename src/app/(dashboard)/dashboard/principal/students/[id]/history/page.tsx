import Link from "next/link";
import {
  ChevronRight,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Award,
  CalendarClock,
  BookOpenCheck,
  type LucideIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";
import { getStudent } from "@/lib/students/queries";
import {
  getConceptAccuracySummary,
  getConceptHeatmap,
  getStudentKpiSummary,
  listLearningItems,
  listScansForStudent,
  listSessionNotes,
  WEAK_ACCURACY_THRESHOLD,
  MIN_SAMPLE_SIZE,
  type ConceptHeatmapCell,
  type ConceptHeatmapQuarterGroup,
  type PaceStatus,
} from "@/lib/learning-history/queries";
import { WrongAnswerWorkspace, type ItemGroup } from "@/components/dashboard/wrong-answer-workspace";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { GRADE_LABELS, TRACK_LABELS } from "@/lib/students/schema";
import { getCurrentQuarter, QUARTER_LABELS_KO } from "@/lib/curriculum-quarter";
import { todayInEasternTime } from "@/lib/dates";
import type { LearningItem } from "@/lib/supabase/types";

const TABS = [
  { value: "concept", label: "단원별 취약 유형" },
  { value: "period", label: "기간별 오답" },
  { value: "session", label: "학습지" },
] as const;
type Tab = (typeof TABS)[number]["value"];

const TREND_WINDOW = 8;

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function resolveTab(raw: string | undefined): Tab {
  return TABS.some((t) => t.value === raw) ? (raw as Tab) : "concept";
}

function buildConceptTrend(items: LearningItem[], conceptId: string | null) {
  return items
    .filter((i) => i.concept_id === conceptId)
    .sort((a, b) => a.session_date.localeCompare(b.session_date))
    .slice(-TREND_WINDOW);
}

function groupByStrand<T extends { strand: string | null }>(rows: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const key = row.strand ?? "미분류";
    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }
  return [...groups.entries()];
}

export default async function StudentHistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; from?: string; to?: string }>;
}) {
  await requireRole("principal");
  const { id } = await params;
  const { tab: rawTab, from: rawFrom, to: rawTo } = await searchParams;
  const tab = resolveTab(rawTab);

  const student = await getStudent(id);
  if (!student) notFound();

  const [recentSummary, allTimeSummary, items, notes, kpi, heatmap, scans] = await Promise.all([
    getConceptAccuracySummary(id, { from: daysAgoIso(30) }),
    getConceptAccuracySummary(id),
    listLearningItems(id),
    listSessionNotes(id),
    getStudentKpiSummary(id, student.grade),
    getConceptHeatmap(id, student.grade, student.track),
    listScansForStudent(id),
  ]);
  const currentQuarter = getCurrentQuarter();

  const allTimeByConceptId = new Map(allTimeSummary.map((s) => [s.conceptId, s]));
  const weakConceptCount = recentSummary.filter((s) => s.isWeak).length;
  const strandGroups = groupByStrand(recentSummary);

  const periodFrom = rawFrom || daysAgoIso(30);
  const periodTo = rawTo || todayInEasternTime();
  const periodItems = items.filter(
    (i) => !i.is_correct && i.session_date >= periodFrom && i.session_date <= periodTo,
  );

  const scansById = new Map(scans.map((s) => [s.id, s]));

  const sessionGroups = new Map<string, LearningItem[]>();
  for (const item of items) {
    if (item.is_correct) continue;
    const group = sessionGroups.get(item.scan_id) ?? [];
    group.push(item);
    sessionGroups.set(item.scan_id, group);
  }
  const sortedSessionGroups = [...sessionGroups.entries()].sort(
    (a, b) => b[1][0].session_date.localeCompare(a[1][0].session_date),
  );

  const periodGroups: ItemGroup[] = [{ key: "period", items: periodItems }];
  const sessionItemGroups: ItemGroup[] = sortedSessionGroups.map(([scanId, groupItems]) => {
    const name = scansById.get(scanId)?.original_filename ?? groupItems[0].session_date;
    return {
      key: scanId,
      label: `학습지 (${name}) · ${groupItems.length}문항`,
      items: groupItems,
    };
  });

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Learning History
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            {student.full_name} - 학습 리포트
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <KpiCard icon={GraduationCap} label="학년" value={GRADE_LABELS[student.grade]} />
          <KpiCard
            icon={TrendingUp}
            label="최근 30일 정답률"
            value={kpi.recentAccuracyRate === null ? "기록 없음" : `${kpi.recentAccuracyRate}%`}
            sub={kpi.recentTotal > 0 ? `${kpi.recentTotal}문항` : undefined}
            warn={
              kpi.recentAccuracyRate !== null &&
              kpi.recentTotal >= MIN_SAMPLE_SIZE &&
              kpi.recentAccuracyRate < WEAK_ACCURACY_THRESHOLD
            }
          />
          <KpiCard
            icon={AlertTriangle}
            label="주의필요 개념 수"
            value={`${weakConceptCount}개`}
            sub={recentSummary.length > 0 ? `${recentSummary.length}개 개념 중` : undefined}
            warn={weakConceptCount > 0}
          />
          <KpiCard
            icon={Award}
            label="전체 누적 정답률"
            value={kpi.allTimeAccuracyRate === null ? "기록 없음" : `${kpi.allTimeAccuracyRate}%`}
            sub={kpi.allTimeTotal > 0 ? `${kpi.allTimeTotal}문항` : undefined}
          />
          <KpiCard icon={CalendarClock} label="마지막 수업일" value={kpi.lastSessionDate ?? "-"} />
          <KpiCard
            icon={BookOpenCheck}
            label="학년 커리큘럼 커버리지"
            value={kpi.curriculumCoverage.rate === null ? "-" : `${kpi.curriculumCoverage.rate}%`}
            sub={`${kpi.curriculumCoverage.covered}/${kpi.curriculumCoverage.total}개 개념`}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={`?tab=${t.value}`}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors font-ko ${
                tab === t.value
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-700 hover:bg-navy-100"
              }`}
              lang="ko"
            >
              {t.label}
            </Link>
          ))}
        </div>

        {tab === "concept" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              개념별 정답률
            </h2>
            <details className="group mt-1">
              <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-xs text-navy-500 hover:text-navy-700 [&::-webkit-details-marker]:hidden">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-90" />
                설명 보기
              </summary>
              <p className="mt-1 text-xs text-navy-500">
                단원(strand)별로 묶여 표시됩니다 · 최근 30일 vs 전체 누적 · 취약(주의필요) 개념이 상단에 정렬됩니다
              </p>
            </details>

            {recentSummary.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
                아직 확정된 학습이력이 없습니다.
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                {strandGroups.map(([strand, rows]) => (
                  <div key={strand}>
                    <h3 className="text-sm font-semibold text-navy-800 font-ko" lang="ko">
                      {strand}
                    </h3>
                    <div className="mt-2 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm touch-pan-x">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-navy-50/50 text-xs uppercase tracking-wide text-navy-500">
                          <tr>
                            <th className="px-4 py-2.5">개념</th>
                            <th className="px-4 py-2.5">최근 30일</th>
                            <th className="px-4 py-2.5">전체 누적</th>
                            <th className="px-4 py-2.5">최근 추이</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => {
                            const allTime = allTimeByConceptId.get(row.conceptId);
                            const trend = buildConceptTrend(items, row.conceptId);
                            return (
                              <tr key={row.conceptId ?? "unassigned"} className="border-t border-navy-100">
                                <td className="px-4 py-2.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-medium text-navy-900">{row.label}</span>
                                    {row.isWeak && (
                                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                        주의필요
                                      </span>
                                    )}
                                    {row.isLowSample && (
                                      <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-500">
                                        표본부족
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-navy-700">
                                  {row.accuracyRate}% ({row.correct}/{row.total})
                                </td>
                                <td className="px-4 py-2.5 text-navy-700">
                                  {allTime ? `${allTime.accuracyRate}% (${allTime.correct}/${allTime.total})` : "-"}
                                </td>
                                <td className="px-4 py-2.5 tracking-widest">
                                  {trend.length === 0
                                    ? "-"
                                    : trend.map((t, idx) => (
                                        <span
                                          key={idx}
                                          className={t.is_correct ? "text-green-600" : "text-red-600"}
                                        >
                                          {t.is_correct ? "✓" : "✗"}
                                        </span>
                                      ))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {heatmap.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
                  학년 커리큘럼 현황
                </h2>
                <details className="group mt-1">
                  <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-xs text-navy-500 hover:text-navy-700 [&::-webkit-details-marker]:hidden">
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-90" />
                    설명 및 범례 보기
                  </summary>
                  <p className="mt-1 text-xs text-navy-500 font-ko" lang="ko">
                    {GRADE_LABELS[student.grade]} · {TRACK_LABELS[student.track]} 트랙 · 전체 누적 데이터 · 현재{" "}
                    {QUARTER_LABELS_KO[currentQuarter]}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-600 font-ko" lang="ko">
                    <LegendSwatch swatchClassName="border-green-300 bg-green-100" label="양호 (70%+)" />
                    <LegendSwatch swatchClassName="border-red-300 bg-red-100" label="주의필요 (70% 미만)" />
                    <LegendSwatch swatchClassName="border-amber-300 bg-amber-100" label="표본부족 (3문항 미만)" />
                    <LegendSwatch swatchClassName="border-navy-200 bg-navy-50" label="데이터 없음" />
                    <LegendSwatch swatchClassName="border-blue-300 bg-blue-100" label="선행 학습 중 (다음 분기 이후 개념)" />
                    <LegendSwatch swatchClassName="border-red-600 bg-red-600" label="진도 지연 (이번 분기까지 학습 필요, 기록 없음)" />
                    <LegendSwatch swatchClassName="border-emerald-300 bg-emerald-100" label="이전 학년 완료 (이미 학습한 선행 개념)" />
                  </div>
                </details>

                <div className="mt-5 space-y-3">
                  {heatmap.map((group) => {
                    const isCurrent = group.groupKind === "quarter" && group.quarter === currentQuarter;
                    const heading =
                      group.groupKind === "quarter" && group.quarter
                        ? QUARTER_LABELS_KO[group.quarter]
                        : group.groupKind === "mastered_prior_grade"
                          ? "이전 학년에서 학습 완료"
                          : "선수 학습 개념 (분기 미지정)";
                    const description =
                      group.groupKind === "mastered_prior_grade"
                        ? "특정 분기에 새로 배우는 개념이 아니라, 이전 학년 심화 과정에서 이미 학습한 개념입니다."
                        : group.groupKind === "unscheduled"
                          ? "특정 분기에 새로 배우는 개념이 아니라, 이미 알고 있다고 가정하는 기초 개념입니다."
                          : null;
                    const { total, dueCount, aheadCount } = summarizeGroup(group);
                    const key = group.quarter ?? group.groupKind;
                    const body = (
                      <div className="space-y-4">
                        {group.strands.map((strand) => (
                          <div key={strand.strand}>
                            <h4 className="text-sm font-semibold text-navy-800 font-ko" lang="ko">
                              {strand.strand}
                            </h4>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                              {strand.cells.map((cell) => (
                                <HeatmapCell key={cell.conceptId} cell={cell} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );

                    if (isCurrent) {
                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-blue-200 bg-blue-50/40 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-navy-900 font-ko" lang="ko">
                              {heading}
                            </h3>
                            <span
                              className="rounded-full bg-navy-900 px-2 py-0.5 text-[10px] font-bold text-white"
                              lang="ko"
                            >
                              현재
                            </span>
                            <span className="text-xs text-navy-500 font-ko" lang="ko">
                              개념 {total}개
                            </span>
                            <GroupStatusChips dueCount={dueCount} aheadCount={aheadCount} />
                          </div>
                          {description && (
                            <p className="mt-1 text-xs text-navy-500 font-ko" lang="ko">
                              {description}
                            </p>
                          )}
                          <div className="mt-3">{body}</div>
                        </div>
                      );
                    }

                    return (
                      <details
                        key={key}
                        className="group overflow-hidden rounded-xl border border-navy-100 bg-white"
                      >
                        <summary
                          className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 hover:bg-navy-50/60 [&::-webkit-details-marker]:hidden"
                        >
                          <ChevronRight className="h-4 w-4 shrink-0 text-navy-400 transition-transform group-open:rotate-90" />
                          <h3 className="text-base font-bold text-navy-900 font-ko" lang="ko">
                            {heading}
                          </h3>
                          <span className="text-xs text-navy-500 font-ko" lang="ko">
                            개념 {total}개
                          </span>
                          <span className="ml-auto">
                            <GroupStatusChips dueCount={dueCount} aheadCount={aheadCount} />
                          </span>
                        </summary>
                        <div className="space-y-3 px-4 pb-4 pt-1">
                          {description && (
                            <p className="text-xs text-navy-500 font-ko" lang="ko">
                              {description}
                            </p>
                          )}
                          {body}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "period" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              기간별 오답 · 유사문제 생성
            </h2>
            <form method="get" className="mt-3 flex flex-wrap items-end gap-3">
              <input type="hidden" name="tab" value="period" />
              <label className="flex flex-col gap-1 text-xs text-navy-600">
                시작일
                <input
                  type="date"
                  name="from"
                  defaultValue={periodFrom}
                  className="rounded-lg border border-navy-200 px-2.5 py-1.5 text-sm text-navy-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-navy-600">
                종료일
                <input
                  type="date"
                  name="to"
                  defaultValue={periodTo}
                  className="rounded-lg border border-navy-200 px-2.5 py-1.5 text-sm text-navy-900"
                />
              </label>
              <button
                type="submit"
                className="rounded-lg bg-navy-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
              >
                조회
              </button>
            </form>

            <div className="mt-4">
              <WrongAnswerWorkspace studentId={id} groups={periodGroups} />
            </div>
          </div>
        )}

        {tab === "session" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              학습지 목록
            </h2>
            <div className="mt-4 space-y-2">
              {scans.length === 0 ? (
                <p className="text-sm text-navy-600">아직 업로드된 학습지가 없습니다.</p>
              ) : (
                scans.map((scan) => (
                  <Link
                    key={scan.id}
                    href={`/dashboard/principal/worksheets/${scan.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white p-3 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-navy-800">
                        {scan.original_filename ?? scan.session_date}
                      </span>
                      {scan.original_filename && (
                        <span className="text-xs text-navy-500">{scan.session_date}</span>
                      )}
                    </div>
                    <ScanStatusBadge status={scan.status} />
                  </Link>
                ))
              )}
            </div>

            <h3 className="mt-8 text-base font-semibold text-navy-900 font-ko" lang="ko">
              학습지별 오답 · 유사문제 생성
            </h3>
            <div className="mt-4">
              <WrongAnswerWorkspace studentId={id} groups={sessionItemGroups} />
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
            학습 리포트
          </h2>
          <div className="mt-4 space-y-2">
            {notes.length === 0 ? (
              <p className="text-sm text-navy-600">아직 남긴 메모가 없습니다.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs text-navy-500">{note.session_date}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-navy-800 font-ko" lang="ko">
                    {note.note}
                  </p>
                  {note.scan_id && (
                    <Link
                      href={`/dashboard/principal/worksheets/${note.scan_id}`}
                      className="mt-2 inline-block text-xs font-medium text-navy-600 underline underline-offset-2 hover:text-navy-800"
                    >
                      원본 학습지 보기
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function LegendSwatch({ swatchClassName, label }: { swatchClassName: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-sm border ${swatchClassName}`} />
      {label}
    </span>
  );
}

function summarizeGroup(group: ConceptHeatmapQuarterGroup) {
  const cells = group.strands.flatMap((s) => s.cells);
  return {
    total: cells.length,
    dueCount: cells.filter((c) => c.paceStatus === "due").length,
    aheadCount: cells.filter((c) => c.paceStatus === "ahead").length,
  };
}

function GroupStatusChips({ dueCount, aheadCount }: { dueCount: number; aheadCount: number }) {
  if (dueCount === 0 && aheadCount === 0) return null;
  return (
    <span className="flex items-center gap-1.5">
      {dueCount > 0 && (
        <span
          className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white"
          lang="ko"
        >
          진도 지연 {dueCount}
        </span>
      )}
      {aheadCount > 0 && (
        <span
          className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700"
          lang="ko"
        >
          선행 {aheadCount}
        </span>
      )}
    </span>
  );
}

function heatmapCellClasses(cell: ConceptHeatmapCell): string {
  if (cell.total === 0) return "border-navy-200 bg-navy-50 text-navy-400";
  if (cell.isWeak) return "border-red-300 bg-red-100 text-red-700";
  if (cell.isLowSample) return "border-amber-300 bg-amber-100 text-amber-700";
  return "border-green-300 bg-green-100 text-green-700";
}

function paceBadge(status: PaceStatus): { label: string; className: string } | null {
  if (status === "ahead") return { label: "선행", className: "bg-blue-100 text-blue-700" };
  if (status === "due") return { label: "진도 지연", className: "bg-red-600 text-white" };
  if (status === "mastered_prior_grade")
    return { label: "이전 학년 완료", className: "bg-emerald-100 text-emerald-700" };
  return null;
}

function HeatmapCell({ cell }: { cell: ConceptHeatmapCell }) {
  const valueLabel = cell.total === 0 ? "데이터 없음" : `${cell.accuracyRate}% (${cell.total}문항)`;
  const quarterLabel = cell.quarter ? ` · ${QUARTER_LABELS_KO[cell.quarter]}` : "";
  const badge = paceBadge(cell.paceStatus);
  return (
    <div
      title={`${cell.label} · ${valueLabel}${quarterLabel}`}
      className={`relative flex flex-col justify-between rounded-lg border p-2.5 ${heatmapCellClasses(cell)}`}
    >
      {badge && (
        <span
          className={`absolute -top-1.5 -right-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${badge.className}`}
        >
          {badge.label}
        </span>
      )}
      <p className="text-xs font-medium leading-snug font-ko" lang="ko">
        {cell.label}
      </p>
      <p className="mt-1.5 text-sm font-bold">{cell.total === 0 ? "–" : `${cell.accuracyRate}%`}</p>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  warn,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${warn ? "border-red-200" : "border-navy-100"}`}>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            warn ? "bg-red-100 text-red-600" : "bg-navy-50 text-navy-500"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <p className="text-xs font-medium text-navy-500 font-ko" lang="ko">
          {label}
        </p>
      </div>
      <p
        className={`mt-2 text-lg font-bold font-ko ${warn ? "text-red-600" : "text-navy-900"}`}
        lang="ko"
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-navy-500">{sub}</p>}
    </div>
  );
}

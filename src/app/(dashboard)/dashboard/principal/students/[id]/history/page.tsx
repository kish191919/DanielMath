import Link from "next/link";
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
  listSessionNotes,
  WEAK_ACCURACY_THRESHOLD,
  MIN_SAMPLE_SIZE,
  type ConceptHeatmapCell,
  type PaceStatus,
} from "@/lib/learning-history/queries";
import { WrongAnswerWorkspace, type ItemGroup } from "@/components/dashboard/wrong-answer-workspace";
import { GRADE_LABELS, TRACK_LABELS } from "@/lib/students/schema";
import { getCurrentQuarter, QUARTER_LABELS_KO } from "@/lib/curriculum-quarter";
import type { LearningItem } from "@/lib/supabase/types";

const TABS = [
  { value: "concept", label: "단원별 취약 유형" },
  { value: "period", label: "기간별 오답" },
  { value: "session", label: "학습지별 오답" },
] as const;
type Tab = (typeof TABS)[number]["value"];

const TREND_WINDOW = 8;

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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

  const [recentSummary, allTimeSummary, items, notes, kpi, heatmap] = await Promise.all([
    getConceptAccuracySummary(id, { from: daysAgoIso(30) }),
    getConceptAccuracySummary(id),
    listLearningItems(id),
    listSessionNotes(id),
    getStudentKpiSummary(id, student.grade),
    getConceptHeatmap(id, student.grade, student.track),
  ]);
  const currentQuarter = getCurrentQuarter();

  const allTimeByConceptId = new Map(allTimeSummary.map((s) => [s.conceptId, s]));

  const periodFrom = rawFrom || daysAgoIso(30);
  const periodTo = rawTo || todayIso();
  const periodItems = items.filter(
    (i) => !i.is_correct && i.session_date >= periodFrom && i.session_date <= periodTo,
  );

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
  const sessionItemGroups: ItemGroup[] = sortedSessionGroups.map(([scanId, groupItems]) => ({
    key: scanId,
    label: `학습지 (${groupItems[0].session_date}) · ${groupItems.length}문항`,
    items: groupItems,
  }));

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

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="학년" value={GRADE_LABELS[student.grade]} />
          <KpiCard
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
            label="전체 누적 정답률"
            value={kpi.allTimeAccuracyRate === null ? "기록 없음" : `${kpi.allTimeAccuracyRate}%`}
            sub={kpi.allTimeTotal > 0 ? `${kpi.allTimeTotal}문항` : undefined}
          />
          <KpiCard label="마지막 수업일" value={kpi.lastSessionDate ?? "-"} />
          <KpiCard
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
            {heatmap.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
                  학년 커리큘럼 현황
                </h2>
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
                </div>

                <div className="mt-4 space-y-5">
                  {heatmap.map((group) => (
                    <div key={group.strand}>
                      <h3 className="text-sm font-semibold text-navy-800 font-ko" lang="ko">
                        {group.strand}
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {group.cells.map((cell) => (
                          <HeatmapCell key={cell.conceptId} cell={cell} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="mt-10 text-lg font-semibold text-navy-900 font-ko" lang="ko">
              개념별 정답률
            </h2>
            <p className="mt-1 text-xs text-navy-500">
              최근 30일 vs 전체 누적 · 취약(주의필요) 개념이 상단에 정렬됩니다
            </p>

            {recentSummary.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
                아직 확정된 학습이력이 없습니다.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm">
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
                    {recentSummary.map((row) => {
                      const allTime = allTimeByConceptId.get(row.conceptId);
                      const trend = buildConceptTrend(items, row.conceptId);
                      return (
                        <tr key={row.conceptId ?? "unassigned"} className="border-t border-navy-100">
                          <td className="px-4 py-2.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-medium text-navy-900">{row.label}</span>
                              {row.strand && (
                                <span className="text-xs text-navy-500">{row.strand}</span>
                              )}
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
            )}
          </div>
        )}

        {tab === "period" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              기간별 오답
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
              학습지별 오답
            </h2>
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

function heatmapCellClasses(cell: ConceptHeatmapCell): string {
  if (cell.total === 0) return "border-navy-200 bg-navy-50 text-navy-400";
  if (cell.isWeak) return "border-red-300 bg-red-100 text-red-700";
  if (cell.isLowSample) return "border-amber-300 bg-amber-100 text-amber-700";
  return "border-green-300 bg-green-100 text-green-700";
}

function paceBadge(status: PaceStatus): { label: string; className: string } | null {
  if (status === "ahead") return { label: "선행", className: "bg-blue-100 text-blue-700" };
  if (status === "due") return { label: "진도 지연", className: "bg-red-600 text-white" };
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
  label,
  value,
  sub,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-navy-500 font-ko" lang="ko">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-bold font-ko ${warn ? "text-red-600" : "text-navy-900"}`}
        lang="ko"
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-navy-500">{sub}</p>}
    </div>
  );
}

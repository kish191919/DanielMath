import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";
import { getStudent } from "@/lib/students/queries";
import {
  getConceptAccuracySummary,
  listLearningItems,
  listSessionNotes,
} from "@/lib/learning-history/queries";
import { WrongAnswerWorkspace, type ItemGroup } from "@/components/dashboard/wrong-answer-workspace";
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

  const [recentSummary, allTimeSummary, items, notes] = await Promise.all([
    getConceptAccuracySummary(id, { from: daysAgoIso(30) }),
    getConceptAccuracySummary(id),
    listLearningItems(id),
    listSessionNotes(id),
  ]);

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
            {student.full_name} — 학습이력 / 오답노트
          </h1>
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
            수업 메모
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
                  <p className="mt-1 text-sm text-navy-800 font-ko" lang="ko">
                    {note.note}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

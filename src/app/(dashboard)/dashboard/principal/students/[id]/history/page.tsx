import Link from "next/link";
import { GraduationCap, CalendarClock } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";
import { getStudent } from "@/lib/students/queries";
import {
  listLearningItems,
  listScansForStudent,
  listSessionNotes,
} from "@/lib/learning-history/queries";
import { BackLink } from "@/components/ui/back-link";
import { WrongAnswerWorkspace, type ItemGroup } from "@/components/dashboard/wrong-answer-workspace";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GRADE_LABELS } from "@/lib/students/schema";
import { todayInEasternTime } from "@/lib/dates";
import type { LearningItem } from "@/lib/supabase/types";

const TABS = [
  { value: "period", label: "기간별 오답" },
  { value: "session", label: "학습지" },
] as const;
type Tab = (typeof TABS)[number]["value"];

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function resolveTab(raw: string | undefined): Tab {
  return TABS.some((t) => t.value === raw) ? (raw as Tab) : "period";
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

  const [items, notes, scans] = await Promise.all([
    listLearningItems(id),
    listSessionNotes(id),
    listScansForStudent(id),
  ]);
  const lastSessionDate = scans[0]?.session_date ?? null;

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
        <BackLink label="학생 목록으로 돌아가기" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Learning History
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            {student.full_name} - 학습 리포트
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <KpiCard icon={GraduationCap} label="학년" value={GRADE_LABELS[student.grade]} />
          <KpiCard icon={CalendarClock} label="마지막 수업일" value={lastSessionDate ?? "-"} />
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

import Link from "next/link";
import { ArrowLeft, ChevronRight, Paperclip } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { AttendanceCalendar } from "@/components/dashboard/attendance-calendar";
import { requireRole } from "@/lib/dal";
import { GRADE_LABELS } from "@/lib/students/schema";
import { todayInEasternTime } from "@/lib/dates";
import type { SessionNote } from "@/lib/supabase/types";
import {
  listChildrenForParent,
  getConceptAccuracySummaryForParent,
  listSessionNotesForParent,
  listSessionNotesForParentByDate,
  listSessionNoteDatesForParent,
  getSignedScanViewUrlsForParent,
  listAttendanceForParent,
} from "@/lib/learning-history/queries";

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function buildProgressHref(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/dashboard/parent/progress?${qs}` : "/dashboard/parent/progress";
}

export default async function ParentProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; month?: string; note?: string }>;
}) {
  const session = await requireRole("parent");
  const { child: rawChildId, month: rawMonth, note: rawNote } = await searchParams;
  const children = await listChildrenForParent(session.userId);

  const filterChildId =
    rawChildId && children.some((c) => c.id === rawChildId) ? rawChildId : null;
  const visibleChildren = filterChildId
    ? children.filter((c) => c.id === filterChildId)
    : children;

  const month =
    rawMonth && /^\d{4}-\d{2}$/.test(rawMonth) ? rawMonth : todayInEasternTime().slice(0, 7);
  const noteDate = rawNote && /^\d{4}-\d{2}-\d{2}$/.test(rawNote) ? rawNote : null;

  const childData = await Promise.all(
    visibleChildren.map(async (child) => {
      const [recentSummary, notes, attendance, reportDates, dateNotes] = await Promise.all([
        getConceptAccuracySummaryForParent(session.userId, child.id, { from: daysAgoIso(30) }),
        listSessionNotesForParent(session.userId, child.id, 3),
        listAttendanceForParent(session.userId, child.id, month),
        listSessionNoteDatesForParent(session.userId, child.id, month),
        noteDate
          ? listSessionNotesForParentByDate(session.userId, child.id, noteDate)
          : Promise.resolve([] as SessionNote[]),
      ]);
      const allNotes = [...notes, ...dateNotes];
      const scanIds = allNotes
        .map((note) => note.scan_id)
        .filter((scanId): scanId is string => scanId !== null);
      const signedUrls = await getSignedScanViewUrlsForParent(session.userId, child.id, scanIds);
      const attachUrls = (list: SessionNote[]) =>
        list.map((note) => ({
          ...note,
          worksheetUrl: note.scan_id ? (signedUrls.get(note.scan_id) ?? null) : null,
        }));
      return {
        child,
        recentSummary,
        notes: attachUrls(notes),
        dateNotes: attachUrls(dateNotes),
        attendance,
        reportDates,
      };
    }),
  );

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Link>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
            Progress
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            우리 아이 진행 상황
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            최근 30일간 업로드된 학습지를 기준으로 한 개념별 정답률과 선생님이 남긴 학습 리포트입니다.
          </p>
          {filterChildId && (
            <Link
              href={buildProgressHref({
                month: rawMonth ? month : undefined,
                note: noteDate ?? undefined,
              })}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
            >
              전체 자녀 보기
            </Link>
          )}
        </div>

        {childData.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
            등록된 자녀가 없습니다. 원장님께 문의해주세요.
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {childData.map(({ child, recentSummary, notes, dateNotes, attendance, reportDates }) => {
              // Unassigned ("미분류") rows are an internal data-tagging gap,
              // not something a parent can act on, so they're hidden here.
              const visibleSummary = recentSummary.filter((row) => row.conceptId !== null);
              return (
                <details key={child.id} id={`child-${child.id}`} open className="group/child">
                <summary className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
                  <ChevronRight className="h-4 w-4 shrink-0 text-navy-400 transition-transform group-open/child:rotate-90" />
                  <h2 className="text-lg font-semibold text-navy-900">{child.full_name}</h2>
                  <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                    {GRADE_LABELS[child.grade]}
                  </span>
                </summary>

                <div className="mt-4 pl-6">
                <details className="group/table">
                  <summary className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
                    <ChevronRight className="h-4 w-4 shrink-0 text-navy-400 transition-transform group-open/table:rotate-90" />
                    <h3 className="text-sm font-semibold text-navy-700 font-ko" lang="ko">
                      개념별 정답률 (최근 30일)
                    </h3>
                  </summary>
                  {visibleSummary.length === 0 ? (
                    <p className="mt-2 text-sm text-navy-600">아직 기록된 학습이력이 없습니다.</p>
                  ) : (
                    <>
                    <details className="group/info mt-2">
                      <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-navy-500 font-ko [&::-webkit-details-marker]:hidden" lang="ko">
                        <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-open/info:rotate-90" />
                        <span>정답률 계산 방식 안내</span>
                      </summary>
                      <p className="mt-1 text-xs text-navy-500 font-ko" lang="ko">
                        이 정답률은 선생님이 업로드한 학습지를 기준으로 계산됩니다. 학생이 푼 모든 문제가 아니라
                        선생님이 필요하다고 판단한 일부만 올라올 수 있어, 실제보다 낮게 보일 수 있어요. &quot;복습
                        자료 위주&quot; 표시가 붙은 개념은 특히 그렇습니다.
                      </p>
                    </details>
                    <div className="mt-2 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-navy-50/50 text-xs uppercase tracking-wide text-navy-500">
                          <tr>
                            <th className="px-4 py-2.5">개념</th>
                            <th className="px-4 py-2.5">정답률</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleSummary.map((row) => (
                            <tr key={row.conceptId} className="border-t border-navy-100">
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
                                  {row.isTargetedReviewHeavy && (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                      복습 자료 위주
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-navy-700">
                                {row.accuracyRate}% ({row.correct}/{row.total})
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    </>
                  )}
                </details>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-navy-700 font-ko" lang="ko">
                    출석 현황
                  </h3>
                  <AttendanceCalendar
                    month={month}
                    entries={attendance}
                    reportDates={reportDates}
                    selectedDate={noteDate}
                    extraParams={filterChildId ? { child: filterChildId } : {}}
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-navy-700 font-ko" lang="ko">
                      {noteDate ? `${noteDate} 학습 리포트` : "학습 리포트 (최근 3개)"}
                    </h3>
                    {noteDate && (
                      <Link
                        href={buildProgressHref({
                          child: filterChildId ?? undefined,
                          month: rawMonth ? month : undefined,
                        })}
                        className="text-xs font-medium text-navy-500 hover:text-navy-900"
                      >
                        최근 리포트 보기
                      </Link>
                    )}
                  </div>
                  {(noteDate ? dateNotes : notes).length === 0 ? (
                    <p className="mt-2 text-sm text-navy-600">
                      {noteDate
                        ? "이 날짜에 작성된 학습 리포트가 없습니다."
                        : "아직 남겨진 메모가 없습니다."}
                    </p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {(noteDate ? dateNotes : notes).map((note, index) => (
                        <details
                          key={note.id}
                          open={noteDate ? true : index === 0}
                          className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
                        >
                          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 hover:bg-navy-50/60 [&::-webkit-details-marker]:hidden">
                            <ChevronRight className="h-4 w-4 shrink-0 text-navy-400 transition-transform group-open:rotate-90" />
                            <span className="shrink-0 text-xs text-navy-500">{note.session_date}</span>
                            <span
                              className="truncate text-sm text-navy-700 font-ko group-open:hidden"
                              lang="ko"
                            >
                              {note.note}
                            </span>
                          </summary>
                          <div className="px-4 pb-4 pt-1">
                            <p className="whitespace-pre-line text-sm text-navy-800 font-ko" lang="ko">
                              {note.note}
                            </p>
                            {note.worksheetUrl && (
                              <Button
                                href={note.worksheetUrl}
                                external
                                variant="secondary"
                                className="mt-3 h-8 gap-1.5 px-3 text-xs"
                              >
                                <Paperclip className="h-3.5 w-3.5" />
                                원본 학습지 보기
                              </Button>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
                </div>
              </details>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}

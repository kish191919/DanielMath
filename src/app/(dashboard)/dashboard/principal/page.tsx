import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import { StudentQuickSearch } from "@/components/dashboard/student-quick-search";
import { TodayClassesWidget } from "@/components/dashboard/today-classes-widget";
import { AttendanceAlertBanner } from "@/components/dashboard/attendance-alert-banner";
import { NewInquiriesWidget } from "@/components/dashboard/new-inquiries-widget";
import { UndeliveredScansWidget } from "@/components/dashboard/undelivered-scans-widget";
import { OverdueTuitionWidget } from "@/components/dashboard/overdue-tuition-widget";
import { StatTile } from "@/components/dashboard/stat-tile";
import { requireRole } from "@/lib/dal";
import { listPendingScans, listRecentScans, listUndeliveredScans } from "@/lib/learning-history/queries";
import { retryGradingAction, deleteWorksheetScanAction } from "@/lib/learning-history/actions";
import { listStudents } from "@/lib/students/queries";
import { groupScansByRoot, toSingleScanGroups } from "@/lib/learning-history/scan-groups";
import { listClassesWithCounts } from "@/lib/classes/queries";
import { listSessionsByDate, listAttendanceSummaries } from "@/lib/class-sessions/queries";
import { listInquiries } from "@/lib/inquiries/queries";
import { listOverdueTuitionPayments, listUnpaidTuitionPayments } from "@/lib/tuition/queries";
import { todayInEasternTime, todayIsoWeekdayInEasternTime } from "@/lib/dates";

// retryGradingAction re-runs the same potentially slow Claude Vision call.
export const maxDuration = 180;

export default async function PrincipalHome() {
  const session = await requireRole("principal");
  const [
    pendingScans,
    undeliveredScans,
    students,
    classesWithCounts,
    inquiries,
    overdueTuition,
    unpaidTuition,
  ] = await Promise.all([
    listPendingScans(),
    listUndeliveredScans(),
    listStudents(),
    listClassesWithCounts(),
    listInquiries(),
    listOverdueTuitionPayments(),
    listUnpaidTuitionPayments(),
  ]);
  const unpaidStudentCount = new Set(unpaidTuition.map((p) => p.student_id)).size;
  const widgetScans =
    pendingScans.length > 0
      ? toSingleScanGroups(pendingScans.slice(0, 6))
      : groupScansByRoot(await listRecentScans(6));
  const studentNameById = new Map(students.map((s) => [s.id, s.full_name]));

  const todaySessions = await listSessionsByDate(todayInEasternTime());
  const attendanceSummaries = await listAttendanceSummaries(todaySessions.map((s) => s.id));
  const absentNames = Object.values(attendanceSummaries).flatMap((s) => s.absentNames);
  const homeworkNotDoneNames = Object.values(attendanceSummaries).flatMap(
    (s) => s.homeworkNotDoneNames,
  );

  const todayWeekday = todayIsoWeekdayInEasternTime();
  const todaysClasses = classesWithCounts
    .filter((c) => c.classRow.is_active && c.classRow.days_of_week.includes(todayWeekday))
    .sort((a, b) => a.classRow.start_time.localeCompare(b.classRow.start_time));

  const allNewInquiries = inquiries.filter((i) => i.status === "new");
  const newInquiries = allNewInquiries.slice(0, 5);

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            원장
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            안녕하세요, {session.profile.full_name ?? session.email} 선생님
          </h1>
          <p className="mt-2 text-sm text-navy-700">
            오늘의 수업 준비를 시작하세요.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="학생" value={students.length} href="/dashboard/principal/students" />
          <StatTile label="반" value={classesWithCounts.length} href="/dashboard/principal/classes" />
          <StatTile
            label="미발송 학부모"
            value={undeliveredScans.length}
            href="/dashboard/principal/worksheets?status=undelivered"
          />
          <StatTile
            label="신규 문의"
            value={allNewInquiries.length}
            href="/dashboard/principal/inquiries?status=new"
          />
          <StatTile
            label="미납 학생"
            value={unpaidStudentCount}
            href="/dashboard/principal/tuition?status=due"
          />
        </div>

        <div className="mt-6">
          <AttendanceAlertBanner
            absentNames={absentNames}
            homeworkNotDoneNames={homeworkNotDoneNames}
          />
        </div>

        <div className="mt-10">
          <OverdueTuitionWidget
            payments={overdueTuition.slice(0, 6)}
            studentNameById={studentNameById}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/dashboard/principal/students/new" variant="secondary">
            학생 등록
          </Button>
          <Button href="/dashboard/principal/worksheets/new">새 학습지 업로드</Button>
          <Button href="/dashboard/principal/practice-sheets/new">유사문제 생성</Button>
        </div>

        <div className="mt-8">
          <StudentQuickSearch students={students} />
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
            오늘의 수업 일정
          </h2>
          <div className="mt-4">
            <TodayClassesWidget classes={todaysClasses} />
          </div>
        </div>

        <div className="mt-10">
          <NewInquiriesWidget inquiries={newInquiries} />
        </div>

        <div className="mt-10">
          <UndeliveredScansWidget scans={undeliveredScans.slice(0, 6)} studentNameById={studentNameById} />
        </div>

        <div className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              최근 업로드 · 확정 대기
            </h2>
            <Link
              href="/dashboard/principal/worksheets"
              className="text-sm font-medium text-navy-600 underline underline-offset-2 hover:text-navy-800"
            >
              전체보기
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {widgetScans.length === 0 ? (
              <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
                아직 업로드된 학습지가 없습니다.
              </div>
            ) : (
              widgetScans.map(({ root, corrections }) => (
                <div
                  key={root.id}
                  className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
                >
                  <div className="flex items-center p-4">
                    <Link
                      href={`/dashboard/principal/worksheets/${root.id}`}
                      className="flex flex-1 items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-navy-900">
                          {studentNameById.get(root.student_id) ?? "알 수 없는 학생"}
                        </p>
                        <p className="mt-1 text-xs text-navy-600">{root.session_date}</p>
                        {corrections.length > 1 && (
                          <p className="mt-1 text-xs text-navy-500">
                            오답 재촬영 {corrections.length}건
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                        <ScanStatusBadge status={root.status} />
                        {corrections.length > 0 && (
                          <ScanStatusBadge status={corrections.at(-1)!.status} />
                        )}
                      </div>
                    </Link>
                    <form
                      action={deleteWorksheetScanAction.bind(null, root.id, root.student_id, undefined)}
                    >
                      <ConfirmSubmitButton
                        label="삭제"
                        confirmMessage="이 학습지 스캔을 삭제하시겠습니까? 채점 결과와 업로드된 원본 파일도 함께 삭제되며 되돌릴 수 없습니다."
                        className="ml-2 shrink-0 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      />
                    </form>
                  </div>
                  {root.status === "grading_failed" && (
                    <div className="border-t border-red-100 bg-red-50 p-3">
                      {root.grading_error && (
                        <p className="text-xs text-red-700">{root.grading_error}</p>
                      )}
                      <form action={retryGradingAction.bind(null, root.id)} className="mt-2">
                        <button
                          type="submit"
                          className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                        >
                          다시 채점하기
                        </button>
                      </form>
                    </div>
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ClassRoster } from "@/components/dashboard/class-roster";
import { ClassSessionLogForm } from "@/components/dashboard/class-session-log-form";
import { ClassSessionLogList } from "@/components/dashboard/class-session-log-list";
import { deleteClassAction } from "@/lib/classes/actions";
import { getClassRoster, listAvailableStudentsForClass } from "@/lib/classes/queries";
import { listClassSessions, listAttendanceSummaries } from "@/lib/class-sessions/queries";
import { requireRole } from "@/lib/dal";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("principal");
  const { id } = await params;

  const data = await getClassRoster(id);
  if (!data) notFound();

  const availableStudents = await listAvailableStudentsForClass(id);
  const sessions = await listClassSessions(id);
  const attendanceBySession = await listAttendanceSummaries(sessions.map((s) => s.id));

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">Class</p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              {data.classRow.name}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/dashboard/principal/classes/${id}/edit`}
              className="rounded-md border border-navy-200 px-3 py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              수정
            </Link>
            <form action={deleteClassAction.bind(null, id)}>
              <button
                type="submit"
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                삭제
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <ClassRoster
            classRow={data.classRow}
            roster={data.roster}
            availableStudents={availableStudents}
          />
        </div>

        <div className="mt-8 space-y-6">
          <ClassSessionLogForm classId={id} roster={data.roster} />
          <ClassSessionLogList
            classId={id}
            sessions={sessions}
            attendanceBySession={attendanceBySession}
          />
        </div>
      </Container>
    </Section>
  );
}

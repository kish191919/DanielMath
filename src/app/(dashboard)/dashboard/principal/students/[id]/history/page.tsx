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
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function StudentHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("principal");
  const { id } = await params;

  const student = await getStudent(id);
  if (!student) notFound();

  const [recentSummary, allTimeSummary, items, notes] = await Promise.all([
    getConceptAccuracySummary(id, { from: daysAgoIso(30) }),
    getConceptAccuracySummary(id),
    listLearningItems(id),
    listSessionNotes(id),
  ]);

  const allTimeByConceptId = new Map(allTimeSummary.map((s) => [s.conceptId, s]));

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

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
            개념별 정답률
          </h2>
          <p className="mt-1 text-xs text-navy-500">최근 30일 vs 전체 누적</p>

          {recentSummary.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
              아직 확정된 학습이력이 없습니다.
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-50/50 text-xs uppercase tracking-wide text-navy-500">
                  <tr>
                    <th className="px-4 py-2.5">개념</th>
                    <th className="px-4 py-2.5">최근 30일</th>
                    <th className="px-4 py-2.5">전체 누적</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSummary.map((row) => {
                    const allTime = allTimeByConceptId.get(row.conceptId);
                    return (
                      <tr key={row.conceptId ?? "unassigned"} className="border-t border-navy-100">
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-navy-900">{row.label}</span>
                          {row.strand && (
                            <span className="ml-2 text-xs text-navy-500">{row.strand}</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-navy-700">
                          {row.accuracyRate}% ({row.correct}/{row.total})
                        </td>
                        <td className="px-4 py-2.5 text-navy-700">
                          {allTime ? `${allTime.accuracyRate}% (${allTime.correct}/${allTime.total})` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
            오답노트 / 문항 이력
          </h2>
          <div className="mt-4 space-y-2">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
                아직 기록된 문항이 없습니다.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-navy-900">
                      {item.problem_number && (
                        <span className="mr-2 font-medium">#{item.problem_number}</span>
                      )}
                      {item.transcribed_problem}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.is_correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.is_correct ? "정답" : "오답"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">
                    <span>{item.session_date}</span>
                    {item.transcribed_answer && <span>학생 답: {item.transcribed_answer}</span>}
                    {item.error_type && <span>{ERROR_TYPE_LABELS[item.error_type]}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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

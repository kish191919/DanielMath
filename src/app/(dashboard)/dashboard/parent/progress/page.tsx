import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";
import { GRADE_LABELS } from "@/lib/students/schema";
import {
  listChildrenForParent,
  getConceptAccuracySummaryForParent,
  listSessionNotesForParent,
} from "@/lib/learning-history/queries";

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function ParentProgressPage() {
  const session = await requireRole("parent");
  const children = await listChildrenForParent(session.userId);

  const childData = await Promise.all(
    children.map(async (child) => {
      const [recentSummary, notes] = await Promise.all([
        getConceptAccuracySummaryForParent(session.userId, child.id, { from: daysAgoIso(30) }),
        listSessionNotesForParent(session.userId, child.id, 10),
      ]);
      return { child, recentSummary, notes };
    }),
  );

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Progress
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            우리 아이 진행 상황
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            최근 30일간 개념별 정답률과 선생님이 남긴 학습 리포트입니다.
          </p>
        </div>

        {childData.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
            등록된 자녀가 없습니다. 원장님께 문의해주세요.
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {childData.map(({ child, recentSummary, notes }) => (
              <div key={child.id}>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-navy-900">{child.full_name}</h2>
                  <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                    {GRADE_LABELS[child.grade]}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-navy-700 font-ko" lang="ko">
                    개념별 정답률 (최근 30일)
                  </h3>
                  {recentSummary.length === 0 ? (
                    <p className="mt-2 text-sm text-navy-600">아직 기록된 학습이력이 없습니다.</p>
                  ) : (
                    <div className="mt-2 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-navy-50/50 text-xs uppercase tracking-wide text-navy-500">
                          <tr>
                            <th className="px-4 py-2.5">개념</th>
                            <th className="px-4 py-2.5">정답률</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentSummary.map((row) => (
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-navy-700 font-ko" lang="ko">
                    학습 리포트
                  </h3>
                  {notes.length === 0 ? (
                    <p className="mt-2 text-sm text-navy-600">아직 남겨진 메모가 없습니다.</p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
                        >
                          <p className="text-xs text-navy-500">{note.session_date}</p>
                          <p className="mt-1 whitespace-pre-line text-sm text-navy-800 font-ko" lang="ko">
                            {note.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

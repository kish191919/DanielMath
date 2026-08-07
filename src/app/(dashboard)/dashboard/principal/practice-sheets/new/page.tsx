import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/dal";
import { listStudents, getStudent } from "@/lib/students/queries";
import { listLearningItems, listConcepts, listScansForStudent } from "@/lib/learning-history/queries";
import {
  listReferenceProblems,
  listReferenceScans,
  getSignedReferenceProblemCropUrls,
} from "@/lib/problem-bank/queries";
import {
  PracticeSheetGeneratorWorkspace,
  type ItemGroup,
  type ReferenceScanGroup,
} from "@/components/dashboard/practice-sheet-generator-workspace";
import { GRADE_LABELS } from "@/lib/students/schema";

// confirmReferenceUploadAction/retryReferenceExtractionAction only trigger
// /api/reference-extraction/run (fast fire-and-wait-for-ack) rather than
// running extractReferenceProblems inline, so this page's own budget just
// needs to cover that round-trip. Must be a literal here (not an imported
// constant) — Next.js reads route segment config via static analysis, not
// module evaluation. Keep this in sync with GRADING_ROUTE_MAX_DURATION_S in
// src/lib/ai/grading-config.ts.
export const maxDuration = 300;

export default async function NewPracticeSheetPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; common?: string }>;
}) {
  await requireRole("principal");
  const { studentId, common } = await searchParams;
  const isCommon = !studentId && common === "1";

  const students = await listStudents();

  if (!studentId && !isCommon) {
    return (
      <Section className="py-10 sm:py-14">
        <Container className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Practice Sheet
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            유사문제 생성
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            학생의 오답과 스캔한 문제를 함께 선택해 AI로 유사문제를 생성합니다. 먼저
            학생을 선택하세요.
          </p>
          <form method="get" className="mt-6 flex items-end gap-3">
            <div className="flex-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide text-navy-500"
                htmlFor="studentId"
              >
                학생
              </label>
              <Select id="studentId" name="studentId" defaultValue="" required className="mt-2">
                <option value="" disabled>
                  학생 선택
                </option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({GRADE_LABELS[s.grade]})
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit">다음</Button>
          </form>

          <div className="mt-8 border-t border-navy-100 pt-6">
            <p className="text-sm text-navy-700 font-ko" lang="ko">
              모든 학생에게 같은 문제를 그대로 나눠줄 학습지를 만드시나요? 학생을
              선택하지 않고 스캔한 문제로 바로 만들 수 있습니다.
            </p>
            <Link
              href="/dashboard/principal/practice-sheets/new?common=1"
              className="mt-3 inline-flex items-center rounded-lg border border-navy-200 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50 font-ko"
              lang="ko"
            >
              학생 선택 없이 공통 학습지 만들기
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const [student, wrongAnswerItems, concepts, referenceProblems, referenceScans, scans] =
    await Promise.all([
      studentId ? getStudent(studentId) : Promise.resolve(null),
      studentId ? listLearningItems(studentId, { onlyIncorrect: true }) : Promise.resolve([]),
      listConcepts(),
      listReferenceProblems({}),
      listReferenceScans(),
      studentId ? listScansForStudent(studentId) : Promise.resolve([]),
    ]);
  if (studentId && !student) notFound();

  // Batched once here (rather than per-card) so the reference-problem list
  // can show crop thumbnails without a signed-URL round trip per card — see
  // getSignedReferenceProblemCropUrls.
  const cropPaths = referenceProblems
    .map((p) => p.crop_storage_path)
    .filter((path): path is string => !!path);
  const cropUrlByPath = await getSignedReferenceProblemCropUrls(cropPaths);
  const cropThumbnailsByProblemId: Record<string, string> = {};
  for (const problem of referenceProblems) {
    const url = problem.crop_storage_path ? cropUrlByPath.get(problem.crop_storage_path) : undefined;
    if (url) cropThumbnailsByProblemId[problem.id] = url;
  }

  const scansById = new Map(scans.map((s) => [s.id, s]));
  const sessionGroups = new Map<string, typeof wrongAnswerItems>();
  for (const item of wrongAnswerItems) {
    const group = sessionGroups.get(item.scan_id) ?? [];
    group.push(item);
    sessionGroups.set(item.scan_id, group);
  }
  const wrongAnswerGroups: ItemGroup[] = [...sessionGroups.entries()]
    .sort((a, b) => b[1][0].session_date.localeCompare(a[1][0].session_date))
    .map(([scanId, groupItems]) => {
      const name = scansById.get(scanId)?.original_filename ?? groupItems[0].session_date;
      return {
        key: scanId,
        label: `학습지 (${name}) · ${groupItems.length}문항`,
        items: groupItems,
      };
    });

  // Scanned problems are global (not student-scoped) — every practice-sheet
  // session sees the same pool of scans, grouped by scan like wrong answers
  // are grouped by session, so a teacher can tell which photo a problem
  // came from.
  const referenceItemsByScan = new Map<string, typeof referenceProblems>();
  for (const item of referenceProblems) {
    const group = referenceItemsByScan.get(item.scan_id) ?? [];
    group.push(item);
    referenceItemsByScan.set(item.scan_id, group);
  }
  const referenceGroups: ReferenceScanGroup[] = [...referenceScans]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((scan) => ({
      scan,
      items: referenceItemsByScan.get(scan.id) ?? [],
    }));

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Practice Sheet
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            {student ? `${student.full_name} — 유사문제 생성` : "공통 학습지 만들기"}
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            {student
              ? "오답과 스캔한 문제를 함께 선택할 수 있습니다. 사진을 찍어 올리면 아래 목록에 바로 추가됩니다."
              : "스캔한 문제 중 원하는 문제를 선택해 모든 학생에게 같은 문제를 출력합니다. 사진을 찍어 올리면 아래 목록에 바로 추가됩니다."}
          </p>
        </div>
        <div className="mt-8">
          <PracticeSheetGeneratorWorkspace
            studentId={studentId ?? null}
            wrongAnswerGroups={wrongAnswerGroups}
            referenceGroups={referenceGroups}
            concepts={concepts}
            cropThumbnailsByProblemId={cropThumbnailsByProblemId}
          />
        </div>
      </Container>
    </Section>
  );
}

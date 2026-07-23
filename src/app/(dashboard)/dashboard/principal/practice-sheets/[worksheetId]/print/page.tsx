import QRCode from "qrcode";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/dashboard/print-button";
import { requireRole } from "@/lib/dal";
import { getPracticeSheetWithProblems } from "@/lib/practice-sheets/queries";
import { getStudent } from "@/lib/students/queries";
import { siteConfig } from "@/lib/site-config";

export default async function PracticeSheetPrintPage({
  params,
}: {
  params: Promise<{ worksheetId: string }>;
}) {
  await requireRole("principal");
  const { worksheetId } = await params;

  const result = await getPracticeSheetWithProblems(worksheetId);
  if (!result) notFound();
  const { worksheet, problems } = result;
  if (worksheet.status !== "confirmed") {
    redirect(`/dashboard/principal/practice-sheets/${worksheetId}`);
  }

  const student = await getStudent(worksheet.student_id);
  if (!student) notFound();

  const title = worksheet.title?.trim() || "연습문제";
  const answersUrl = `${siteConfig.url}/answers/${worksheet.share_token}`;
  const qrSvg = await QRCode.toString(answersUrl, { type: "svg", margin: 1 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 print:max-w-none print:px-0 print:py-0">
      <style>{`
        @page {
          size: letter;
          margin: 15mm;
        }
        @media print {
          .page-break { break-before: page; }
        }
      `}</style>

      <div className="print:hidden mb-6 flex justify-end">
        <PrintButton />
      </div>

      <section>
        <header className="flex items-start justify-between gap-6 border-b-2 border-navy-900 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
              Daniel Math Academy
            </p>
            <h1 className="mt-1 text-2xl font-bold text-navy-900 font-ko" lang="ko">
              {title}
            </h1>
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-navy-800">
              <div className="flex items-center gap-2">
                <dt className="font-ko font-medium" lang="ko">
                  이름
                </dt>
                <dd>{student.full_name}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="font-ko font-medium" lang="ko">
                  날짜
                </dt>
                <dd className="min-w-32 border-b border-navy-400">&nbsp;</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="font-ko font-medium" lang="ko">
                  소요 시간
                </dt>
                <dd className="min-w-16 border-b border-navy-400 text-center">&nbsp;</dd>
                <span className="font-ko" lang="ko">
                  분
                </span>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1">
            <div
              className="h-20 w-20 [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-center text-[10px] leading-tight text-navy-500 font-ko" lang="ko">
              스캔해서
              <br />
              정답 확인
            </p>
          </div>
        </header>

        <ol className="mt-8 columns-1 gap-6 sm:columns-2 print:columns-2">
          {problems.map((problem, index) => (
            <li
              key={problem.id}
              className="mb-6 break-inside-avoid rounded-xl border border-navy-200 p-4"
            >
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-navy-900">{problem.problem_text}</p>
              </div>
              <div className="mt-8 border-b border-navy-300">&nbsp;</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-break mt-10 pt-10">
        <header className="border-b-2 border-navy-900 pb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
            Daniel Math Academy
          </p>
          <h2 className="mt-1 text-lg font-bold text-navy-900 font-ko" lang="ko">
            {title} — 답안지
          </h2>
          <p className="mt-1 text-sm text-navy-600 font-ko" lang="ko">
            {student.full_name}
          </p>
        </header>
        <ol className="mt-6 columns-2 gap-6 text-sm text-navy-800 sm:columns-3 print:columns-3">
          {problems.map((problem, index) => (
            <li key={problem.id} className="mb-2 break-inside-avoid">
              {index + 1}. {problem.answer_text}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

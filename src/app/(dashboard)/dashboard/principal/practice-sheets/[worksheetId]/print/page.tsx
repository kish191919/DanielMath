import QRCode from "qrcode";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/dashboard/print-button";
import { MathText } from "@/components/math-text";
import { requireRole } from "@/lib/dal";
import { getPracticeSheetWithProblems } from "@/lib/practice-sheets/queries";
import { getStudent } from "@/lib/students/queries";
import { siteConfig } from "@/lib/site-config";

const LAYOUTS = {
  "2": {
    problemCols: 2,
    answerCols: 3,
    problemGridClass: "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2",
    answerGridClass:
      "mt-6 grid grid-cols-2 gap-6 text-sm text-navy-800 sm:grid-cols-3 print:grid-cols-3",
  },
  "1": {
    problemCols: 1,
    answerCols: 1,
    problemGridClass: "mt-8 grid grid-cols-1 gap-6",
    answerGridClass: "mt-6 grid grid-cols-1 gap-6 text-sm text-navy-800",
  },
} as const;
type Layout = keyof typeof LAYOUTS;

function BrandMark() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy-900 text-xs font-bold text-white">
      D
    </span>
  );
}

function pillClass(active: boolean) {
  return `inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors font-ko ${
    active ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
  }`;
}

type ArrayChunk<T> = { items: T[]; startIndex: number };

function chunkArray<T>(items: T[], numChunks: number): ArrayChunk<T>[] {
  const chunks: ArrayChunk<T>[] = [];
  const base = Math.floor(items.length / numChunks);
  const remainder = items.length % numChunks;
  let start = 0;
  for (let i = 0; i < numChunks; i++) {
    const size = base + (i < remainder ? 1 : 0);
    chunks.push({ items: items.slice(start, start + size), startIndex: start });
    start += size;
  }
  return chunks;
}

export default async function PracticeSheetPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ worksheetId: string }>;
  searchParams: Promise<{ layout?: string }>;
}) {
  await requireRole("principal");
  const { worksheetId } = await params;
  const { layout: rawLayout } = await searchParams;
  const layout: Layout = rawLayout === "1" ? "1" : "2";
  const { problemCols, answerCols, problemGridClass, answerGridClass } = LAYOUTS[layout];

  const result = await getPracticeSheetWithProblems(worksheetId);
  if (!result) notFound();
  const { worksheet, problems } = result;
  if (worksheet.status !== "confirmed") {
    redirect(`/dashboard/principal/practice-sheets/${worksheetId}`);
  }

  const student = worksheet.student_id ? await getStudent(worksheet.student_id) : null;
  if (worksheet.student_id && !student) notFound();

  const problemColumns = chunkArray(problems, problemCols);
  const answerColumns = chunkArray(problems, answerCols);

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
          html, body { width: auto; overflow: visible; }
          .page-break { break-before: page; }
        }
      `}</style>

      <div className="print:hidden mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Link href="?layout=2" className={pillClass(layout === "2")}>
            2열
          </Link>
          <Link href="?layout=1" className={pillClass(layout === "1")}>
            1열 (전체 폭)
          </Link>
        </div>
        <PrintButton />
      </div>

      <section>
        <header className="flex items-start justify-between gap-6 border-b-2 border-navy-900 pb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BrandMark />
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
                {siteConfig.name}
              </p>
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 rounded-lg bg-navy-50 px-4 py-3 text-sm text-navy-800">
              <div className="flex items-center gap-2">
                <dt className="font-ko font-medium" lang="ko">
                  이름
                </dt>
                <dd className="min-w-32 border-b border-navy-400">&nbsp;</dd>
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

          <div className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-navy-200 p-2">
            <div
              className="h-16 w-16 [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-center text-[10px] leading-tight text-navy-500 font-ko" lang="ko">
              스캔해서
              <br />
              정답 확인
            </p>
          </div>
        </header>

        <div className={problemGridClass}>
          {problemColumns
            .filter((column) => column.items.length > 0)
            .map((column) => (
              <ol key={column.startIndex}>
                {column.items.map((problem, localIndex) => (
                  <li
                    key={problem.id}
                    className="mb-6 break-inside-avoid rounded-2xl border border-navy-200 p-5 [page-break-inside:avoid]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex flex-1 items-start gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                          {column.startIndex + localIndex + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-navy-900">
                            <MathText text={problem.problem_text} />
                          </p>
                          {problem.options && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {problem.options.map((opt) => (
                                <div
                                  key={opt.label}
                                  className="flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1"
                                >
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                                    {opt.label}
                                  </span>
                                  <span className="text-sm text-navy-800">
                                    <MathText text={opt.text} />
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {problem.crop_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL, not a static asset
                        <img
                          src={problem.crop_image_url}
                          alt=""
                          className="max-w-[40%] shrink-0 rounded-md border border-navy-200 object-contain print:max-w-[35%]"
                        />
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-navy-400">
                      <PencilLine className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-medium tracking-wide font-ko" lang="ko">
                        풀이 공간
                      </span>
                    </div>
                    <div className="mt-2 border-b border-navy-300">&nbsp;</div>
                  </li>
                ))}
              </ol>
            ))}
        </div>
      </section>

      <section className="page-break mt-10 pt-10">
        <header className="border-b-2 border-navy-900 pb-3">
          <div className="flex items-center gap-2">
            <BrandMark />
            <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
              {siteConfig.name}
            </p>
          </div>
          <h2 className="mt-1 text-lg font-bold text-navy-900 font-ko" lang="ko">
            답안지
          </h2>
        </header>

        <div className="mt-4 flex items-center gap-2 text-sm text-navy-800">
          <span className="font-ko font-medium" lang="ko">
            채점
          </span>
          <span className="min-w-12 border-b border-navy-400 text-center">&nbsp;</span>
          <span>/ {problems.length}문제</span>
        </div>

        <div className={answerGridClass}>
          {answerColumns
            .filter((column) => column.items.length > 0)
            .map((column) => (
              <ol key={column.startIndex} className="divide-y divide-navy-100">
                {column.items.map((problem, localIndex) => (
                  <li
                    key={problem.id}
                    className="break-inside-avoid py-2 [page-break-inside:avoid]"
                  >
                    {column.startIndex + localIndex + 1}.{" "}
                    {problem.options && problem.correct_option && (
                      <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                        {problem.correct_option}
                      </span>
                    )}
                    <MathText text={problem.answer_text} />
                  </li>
                ))}
              </ol>
            ))}
        </div>

        <p className="mt-10 text-center text-[10px] text-navy-400 font-ko" lang="ko">
          {siteConfig.name} · {siteConfig.url}
        </p>
      </section>
    </div>
  );
}

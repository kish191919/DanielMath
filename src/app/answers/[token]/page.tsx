import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPracticeSheetAnswersByToken } from "@/lib/practice-sheets/queries";
import { MathText } from "@/components/math-text";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PublicAnswerKeyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getPracticeSheetAnswersByToken(token);
  if (!result) notFound();
  const { title, answers } = result;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
        Daniel Math Academy
      </p>
      <h1 className="mt-1 text-xl font-bold text-navy-900 font-ko" lang="ko">
        {title} — 정답
      </h1>

      {answers.length === 0 ? (
        <p className="mt-6 text-sm text-navy-600 font-ko" lang="ko">
          등록된 정답이 없습니다.
        </p>
      ) : (
        <ol className="mt-6 space-y-2.5 text-base text-navy-800">
          {answers.map((answer) => (
            <li key={answer.sort_order}>
              {answer.sort_order + 1}.{" "}
              {answer.correct_option && (
                <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                  {answer.correct_option}
                </span>
              )}
              <MathText text={answer.answer_text} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

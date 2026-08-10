import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { WorksheetViewerLink } from "@/components/dashboard/worksheet-viewer-link";
import { requireRole } from "@/lib/dal";
import { GRADE_LABELS } from "@/lib/students/schema";
import {
  getSessionNoteForParent,
  getSignedScanViewUrlsForParent,
} from "@/lib/learning-history/queries";

export default async function ParentReportDetailPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const session = await requireRole("parent");
  const { noteId } = await params;

  const result = await getSessionNoteForParent(session.userId, noteId);
  if (!result) notFound();
  const { note, student } = result;

  const worksheet = note.scan_id
    ? ((await getSignedScanViewUrlsForParent(session.userId, student.id, [note.scan_id])).get(
        note.scan_id,
      ) ?? null)
    : null;

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
            Learning Report
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
              {student.full_name}&apos;s Learning Report
            </h1>
            <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
              {GRADE_LABELS[student.grade]}
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
          <div className="px-6 py-5">
            <span className="text-xs text-navy-500">{note.session_date}</span>
            <p className="mt-2 whitespace-pre-line text-sm text-navy-800 font-ko" lang="ko">
              {note.note}
            </p>
            {worksheet && (
              <WorksheetViewerLink
                url={worksheet.url}
                mimeType={worksheet.mimeType}
                className="mt-4 h-8 gap-1.5 px-3 text-xs"
              />
            )}
          </div>
        </div>

        <Link
          href={`/dashboard/parent/progress?child=${student.id}`}
          className="mt-6 inline-block text-sm font-medium text-navy-500 hover:text-navy-900"
        >
          View full progress →
        </Link>
      </Container>
    </Section>
  );
}

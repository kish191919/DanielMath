import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { WorksheetViewerCloseButton } from "@/components/dashboard/worksheet-viewer-close-button";
import { WorksheetPdfViewer } from "@/components/dashboard/worksheet-pdf-viewer";
import { requireSession } from "@/lib/dal";

// Only ever linked to with a signed URL we generated for the current
// session's own scan storage object — reject anything else so this route
// can't be used as an open iframe/image proxy for arbitrary URLs.
function isTrustedScanUrl(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  return url.startsWith(`${base}/storage/v1/object/sign/worksheet-scans/`);
}

export default async function WorksheetViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; mime?: string }>;
}) {
  await requireSession();
  const { url, mime } = await searchParams;

  if (!url || !isTrustedScanUrl(url)) notFound();

  const isPdf = mime === "application/pdf";

  return (
    <Section className="py-6 sm:py-10">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between border-b border-navy-100 pb-3">
          <span className="font-ko text-sm font-semibold text-navy-900" lang="ko">
            원본 학습지
          </span>
          <WorksheetViewerCloseButton />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
          {isPdf ? (
            <WorksheetPdfViewer url={url} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL, not a static asset
            <img
              src={url}
              alt="원본 학습지"
              className="max-h-[80vh] w-full object-contain [touch-action:pan-y_pinch-zoom]"
            />
          )}
        </div>
      </Container>
    </Section>
  );
}

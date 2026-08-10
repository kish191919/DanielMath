import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { WorksheetViewerCloseButton } from "@/components/dashboard/worksheet-viewer-close-button";
import { WorksheetPdfViewer } from "@/components/dashboard/worksheet-pdf-viewer";
import { ZoomableMedia } from "@/components/dashboard/zoomable-media";
import { requireSession } from "@/lib/dal";
import { getSignedScanDownloadUrl } from "@/lib/learning-history/queries";

// Only ever linked to with a signed URL we generated for the current
// session's own scan storage object — reject anything else so this route
// can't be used as an open iframe/image proxy for arbitrary URLs.
function isTrustedScanUrl(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  return url.startsWith(`${base}/storage/v1/object/sign/worksheet-scans/`);
}

// The trusted view URL already encodes the storage path — reuse it
// instead of trusting a client-supplied scan/storage id.
function extractStoragePath(url: string, base: string): string {
  const prefix = `${base}/storage/v1/object/sign/worksheet-scans/`;
  return decodeURIComponent(url.slice(prefix.length).split("?")[0]);
}

function downloadFilename(mime: string | undefined): string {
  const ext = mime === "application/pdf" ? "pdf" : mime === "image/png" ? "png" : "jpg";
  return `original-worksheet.${ext}`;
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
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const downloadUrl = await getSignedScanDownloadUrl(
    extractStoragePath(url, base),
    downloadFilename(mime),
  );

  return (
    <Section className="py-6 sm:py-10">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between border-b border-navy-100 pb-3">
          <span className="text-sm font-semibold text-navy-900">
            Original Worksheet
          </span>
          <div className="flex items-center gap-1">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                aria-label="Download"
                className="rounded-full p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900"
              >
                <Download className="h-5 w-5" />
              </a>
            )}
            <WorksheetViewerCloseButton />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
          {isPdf ? (
            <WorksheetPdfViewer url={url} />
          ) : (
            <ZoomableMedia label="Original worksheet image" className="max-h-[80vh]">
              {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL, not a static asset */}
              <img
                src={url}
                alt="Original worksheet"
                className="max-h-[80vh] w-full object-contain"
              />
            </ZoomableMedia>
          )}
        </div>
      </Container>
    </Section>
  );
}

import { PDFDocument } from "pdf-lib";

// Longest edge in px after resize. 1600px keeps handwritten digits/fractions
// legible for Claude Vision OCR (phone photos are typically 3000-4000px on
// the long edge, far more than needed) while keeping each page in the
// ~80-250KB range instead of several MB.
const MAX_DIMENSION_PX = 1600;

// JPEG quality 0-1. 0.82 preserves pencil/pen strokes and printed text
// cleanly for this kind of high-contrast line content while cutting file
// size roughly 4-6x versus quality 0.95+.
const JPEG_QUALITY = 0.82;

export interface CapturedPage {
  id: string;
  blob: Blob;
  previewUrl: string;
}

export async function compressFrameToJpeg(
  source: HTMLCanvasElement,
  maxDimension = MAX_DIMENSION_PX,
  quality = JPEG_QUALITY,
): Promise<Blob> {
  const { width, height } = source;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const outW = Math.max(1, Math.round(width * scale));
  const outH = Math.max(1, Math.round(height * scale));

  let canvas = source;
  if (scale < 1) {
    canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");
    ctx.drawImage(source, 0, 0, outW, outH);
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("이미지를 압축하지 못했습니다.");
  return blob;
}

export async function assembleScanPdf(pages: Blob[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  for (const pageBlob of pages) {
    const bytes = new Uint8Array(await pageBlob.arrayBuffer());
    const jpg = await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([jpg.width, jpg.height]);
    page.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
  }
  const bytes = await pdfDoc.save();
  // pdf-lib's Uint8Array return type doesn't narrow to an ArrayBuffer-backed
  // BlobPart under TS's DOM lib generics, even though it always is one.
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}

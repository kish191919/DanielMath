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

// Directly picked files (vs. camera-captured frames) skip the resize/compress
// step above, so a multi-MB phone photo gets base64-encoded and uploaded at
// full size. This mirrors compressFrameToJpeg's canvas-based approach for
// that upload path. PNGs can carry transparency, which canvas composites as
// black by default, so the canvas is filled white before drawing to avoid a
// black background appearing after the JPEG conversion.
export async function compressImageFileToJpeg(
  file: File,
  maxDimension = MAX_DIMENSION_PX,
  quality = JPEG_QUALITY,
): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
      el.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return compressFrameToJpeg(canvas, maxDimension, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// Directly picked PDFs (vs. camera-captured pages, which are already
// compressed before assembly) were previously uploaded untouched — a
// multi-page scanning-app PDF could be several MB and, since Claude Vision
// gets the raw file bytes, made grading slower and more timeout-prone.
// Mirrors compressFrameToJpeg's approach: render each page to a canvas
// (reusing the same pdfjs-dist pattern as worksheet-pdf-viewer.tsx), JPEG-
// compress it, and reassemble.
// Extracted from compressPdfFile so multi-file selection can pull the JPEG
// pages of a directly-picked PDF into a larger merged page list (see
// use-worksheet-upload.ts's resolveUploadFile) without assembling an
// intermediate single-file PDF first.
export async function pdfFileToJpegBlobs(
  file: File,
  maxDimension = MAX_DIMENSION_PX,
  quality = JPEG_QUALITY,
): Promise<Blob[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  try {
    const pages: Blob[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      // Rendered at 2x before compressFrameToJpeg downscales to
      // maxDimension, so small-but-legible source pages don't lose quality.
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      pages.push(await compressFrameToJpeg(canvas, maxDimension, quality));
    }
    return pages;
  } finally {
    doc.destroy();
  }
}

export async function compressPdfFile(
  file: File,
  maxDimension = MAX_DIMENSION_PX,
  quality = JPEG_QUALITY,
): Promise<Blob> {
  return assembleScanPdf(await pdfFileToJpegBlobs(file, maxDimension, quality));
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

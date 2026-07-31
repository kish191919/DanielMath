export function buildWorksheetViewerHref(url: string, mimeType: string | null): string {
  const params = new URLSearchParams({ url });
  if (mimeType) params.set("mime", mimeType);
  return `/dashboard/worksheet-viewer?${params.toString()}`;
}

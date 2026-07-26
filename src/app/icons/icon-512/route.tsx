import { ImageResponse } from "next/og";
import { iconMonogram } from "@/lib/icon-monogram";

export function GET() {
  return new ImageResponse(iconMonogram(512), { width: 512, height: 512 });
}

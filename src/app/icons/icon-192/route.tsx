import { ImageResponse } from "next/og";
import { iconMonogram } from "@/lib/icon-monogram";

export function GET() {
  return new ImageResponse(iconMonogram(192), { width: 192, height: 192 });
}

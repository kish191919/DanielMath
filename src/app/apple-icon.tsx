import { ImageResponse } from "next/og";
import { iconMonogram } from "@/lib/icon-monogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(iconMonogram(180), size);
}

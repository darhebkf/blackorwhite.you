import type { ImageResponse } from "next/og";
import { renderShadeIcon } from "@/lib/og/shadeIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon(): Promise<ImageResponse> {
  return renderShadeIcon({ size, withBorder: true });
}

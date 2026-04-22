import type { ImageResponse } from "next/og";
import { renderShadeIcon } from "@/lib/og/shadeIcon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default async function IconMaskable(): Promise<ImageResponse> {
  return renderShadeIcon({ size, withBorder: false });
}

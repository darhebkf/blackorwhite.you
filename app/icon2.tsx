import type { ImageResponse } from "next/og";
import { renderShadeIcon } from "@/lib/og/shadeIcon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function IconLarge(): Promise<ImageResponse> {
  return renderShadeIcon({ size, withBorder: true });
}

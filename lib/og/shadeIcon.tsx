import { cookies } from "next/headers";
import { ImageResponse } from "next/og";
import { SHADE_COOKIE, VIEW_COOKIE } from "@/lib/browser/cookie";
import { shadeToHex } from "@/lib/color";

export async function shadeFromCookie(): Promise<number> {
  const store = await cookies();
  const raw = store.get(VIEW_COOKIE)?.value ?? store.get(SHADE_COOKIE)?.value;
  const parsed = raw ? Number.parseFloat(raw) : 100;
  if (!Number.isFinite(parsed)) return 100;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

type Options = {
  size: { width: number; height: number };
  withBorder: boolean;
};

export async function renderShadeIcon({
  size,
  withBorder,
}: Options): Promise<ImageResponse> {
  const shade = await shadeFromCookie();
  const fill = shadeToHex(shade);
  const border = shade > 55 ? "#000000" : "#ffffff";
  const borderWidth = Math.max(2, Math.round(size.width / 48));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: fill,
        boxSizing: "border-box",
        border: withBorder ? `${borderWidth}px solid ${border}` : "none",
      }}
    />,
    { ...size },
  );
}

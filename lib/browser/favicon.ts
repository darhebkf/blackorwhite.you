import { shadeToHex } from "@/lib/color";

const SIZE = 64;

export function generateFaviconDataUrl(shade: number): string | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fill = shadeToHex(shade);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const border = shade > 55 ? "#000000" : "#ffffff";
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, SIZE - 2, SIZE - 2);

  return canvas.toDataURL("image/png");
}

export async function generateFaviconBlob(shade: number): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fill = shadeToHex(shade);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, 512, 512);

  const border = shade > 55 ? "#000000" : "#ffffff";
  ctx.strokeStyle = border;
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, 512 - 16, 512 - 16);

  return await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });
}

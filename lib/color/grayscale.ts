export type ColorCodes = {
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
};

export function clampShade(shade: number): number {
  if (Number.isNaN(shade)) return 100;
  return Math.max(0, Math.min(100, shade));
}

export function shadeToHex(shade: number): string {
  const v = Math.round((clampShade(shade) / 100) * 255);
  const h = v.toString(16).padStart(2, "0").toUpperCase();
  return `#${h}${h}${h}`;
}

export function shadeToRgb(shade: number): string {
  const v = Math.round((clampShade(shade) / 100) * 255);
  return `rgb(${v}, ${v}, ${v})`;
}

export function shadeToHsl(shade: number): string {
  const l = Math.round(clampShade(shade));
  return `hsl(0, 0%, ${l}%)`;
}

export function shadeToOklch(shade: number): string {
  const l = (clampShade(shade) / 100).toFixed(4);
  return `oklch(${l} 0 0)`;
}

export function shadeToColorCodes(shade: number): ColorCodes {
  return {
    hex: shadeToHex(shade),
    rgb: shadeToRgb(shade),
    hsl: shadeToHsl(shade),
    oklch: shadeToOklch(shade),
  };
}

import { clampShade } from "./grayscale";

const DARK_TEXT = "oklch(0.12 0 0)";
const LIGHT_TEXT = "oklch(0.97 0 0)";
const CROSSOVER = 55;

export function foregroundFor(shade: number): string {
  return clampShade(shade) > CROSSOVER ? DARK_TEXT : LIGHT_TEXT;
}

export function backgroundFor(shade: number): string {
  const l = (clampShade(shade) / 100).toFixed(4);
  return `oklch(${l} 0 0)`;
}

export function ruleFor(shade: number): string {
  return foregroundFor(shade);
}

export type ShadeTheme = {
  bg: string;
  fg: string;
  rule: string;
};

export function themeFor(shade: number): ShadeTheme {
  return {
    bg: backgroundFor(shade),
    fg: foregroundFor(shade),
    rule: ruleFor(shade),
  };
}

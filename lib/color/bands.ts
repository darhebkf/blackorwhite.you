import type { ShadeBand } from "@/lib/scoring/types";
import { clampShade } from "./grayscale";

const NAMES: readonly string[] = [
  "Void",
  "Obsidian",
  "Tar",
  "Ink",
  "Midnight",
  "Carbon",
  "Graphite",
  "Anthracite",
  "Slate",
  "Pitch",
  "Lead",
  "Iron",
  "Storm",
  "Thunder",
  "Shadow",
  "Dusk",
  "Ash",
  "Smoke",
  "Gunmetal",
  "Flint",
  "Pewter",
  "Basalt",
  "Steel",
  "Nickel",
  "Tungsten",
  "True Gray",
  "Dove",
  "Cloud",
  "Fog",
  "Mist",
  "Pearl",
  "Pumice",
  "Stone",
  "Lunar",
  "Silver",
  "Platinum",
  "Dune",
  "Driftwood",
  "Parchment",
  "Canvas",
  "Linen",
  "Marble",
  "Chalk",
  "Alabaster",
  "Bone",
  "Cotton",
  "Porcelain",
  "Milk",
  "Snow",
  "Pristine",
] as const;

export const SHADE_BANDS: readonly ShadeBand[] = NAMES.map((name, i) => {
  const min = i * 2;
  const max = i === NAMES.length - 1 ? 100 : i * 2 + 1;
  return { name, min, max };
});

export function bandForShade(shade: number): ShadeBand {
  const s = clampShade(shade);
  const idx = Math.min(Math.floor(s / 2), SHADE_BANDS.length - 1);
  return SHADE_BANDS[idx];
}

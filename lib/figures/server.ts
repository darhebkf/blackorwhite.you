import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Figure } from "./index";

const DIR = join(process.cwd(), "data", "figures");

function loadFigures(): readonly Figure[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
  const out: Figure[] = [];
  for (const file of files) {
    const raw = readFileSync(join(DIR, file), "utf-8");
    out.push(...(JSON.parse(raw) as readonly Figure[]));
  }
  return out.sort((a, b) => a.shade - b.shade);
}

export const FIGURES: readonly Figure[] = loadFigures();

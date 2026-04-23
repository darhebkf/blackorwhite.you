import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type JurisdictionKind = "country" | "aggregate";

export type JurisdictionDescriptor = {
  id: string;
  label: string;
  shortLabel: string;
  adjective: string;
  kind: JurisdictionKind;
  note?: string;
};

const DIR = join(process.cwd(), "data", "jurisdictions");

function loadJurisdictions(): readonly JurisdictionDescriptor[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = readFileSync(join(DIR, file), "utf-8");
      return JSON.parse(raw) as JurisdictionDescriptor;
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export const JURISDICTIONS: readonly JurisdictionDescriptor[] =
  loadJurisdictions();

export type Jurisdiction = string;

export const DEFAULT_JURISDICTION: Jurisdiction = "nl";

export function jurisdictionById(
  id: Jurisdiction,
): JurisdictionDescriptor | undefined {
  return JURISDICTIONS.find((j) => j.id === id);
}

export function isKnownJurisdiction(id: string): boolean {
  return JURISDICTIONS.some((j) => j.id === id);
}

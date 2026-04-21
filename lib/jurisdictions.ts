export type Jurisdiction = "nl" | "eu" | "de" | "fr" | "uk" | "us";

export type JurisdictionStatus = "live" | "coming_soon";

export type JurisdictionDescriptor = {
  id: Jurisdiction;
  label: string;
  status: JurisdictionStatus;
};

export const JURISDICTIONS: readonly JurisdictionDescriptor[] = [
  { id: "nl", label: "Netherlands", status: "live" },
  { id: "eu", label: "Europe (generic)", status: "coming_soon" },
  { id: "de", label: "Deutschland", status: "coming_soon" },
  { id: "fr", label: "France", status: "coming_soon" },
  { id: "uk", label: "United Kingdom", status: "coming_soon" },
  { id: "us", label: "United States", status: "coming_soon" },
] as const;

export const DEFAULT_JURISDICTION: Jurisdiction = "nl";

export function jurisdictionById(id: Jurisdiction): JurisdictionDescriptor {
  const found = JURISDICTIONS.find((j) => j.id === id);
  if (!found) throw new Error(`Unknown jurisdiction: ${id}`);
  return found;
}

export function isLive(id: Jurisdiction): boolean {
  return jurisdictionById(id).status === "live";
}

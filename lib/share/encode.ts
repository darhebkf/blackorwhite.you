import { bandForShade, shadeToColorCodes } from "@/lib/color";
import {
  AXIS_IDS,
  type AxisId,
  archetypeById,
  type QuizResult,
} from "@/lib/scoring";

const VERSION = 1;

type Encoded = {
  v: number;
  s: number;
  a: string;
  x: number[];
};

function toBase64Url(input: string): string {
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(input)
      : Buffer.from(input, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(pad);
  return typeof atob !== "undefined"
    ? atob(padded)
    : Buffer.from(padded, "base64").toString("utf-8");
}

export function encodeResult(result: QuizResult): string {
  const payload: Encoded = {
    v: VERSION,
    s: Math.round(result.shade),
    a: result.archetype.id,
    x: AXIS_IDS.map((id) => Math.round(result.axes[id] * 100)),
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeShadeOnly(slug: string): number | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64Url(slug));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as { v?: unknown; s?: unknown };
  if (p.v !== VERSION) return null;
  if (typeof p.s !== "number" || p.s < 0 || p.s > 100) return null;
  return Math.round(p.s);
}

export function decodeResult(slug: string): QuizResult | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64Url(slug));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<Encoded>;
  if (p.v !== VERSION) return null;
  if (typeof p.s !== "number" || p.s < 0 || p.s > 100) return null;
  if (typeof p.a !== "string") return null;
  if (!Array.isArray(p.x) || p.x.length !== AXIS_IDS.length) return null;

  const archetype = archetypeById(p.a);
  if (!archetype) return null;

  const axes = {} as Record<AxisId, number>;
  for (let i = 0; i < AXIS_IDS.length; i++) {
    const raw = p.x[i];
    if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
    axes[AXIS_IDS[i]] = Math.max(-1, Math.min(1, raw / 100));
  }

  const shade = Math.round(p.s);

  return {
    shade,
    axes,
    band: bandForShade(shade),
    archetype,
    colorCodes: shadeToColorCodes(shade),
    answered: 0,
    total: 0,
  };
}

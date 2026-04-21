import type { AnswerOption } from "@/lib/scoring";

const DEFAULT_LIKERT: readonly string[] = [
  "Never",
  "Once or twice",
  "Sometimes",
  "Often",
  "Always",
];

const INTENSITIES: readonly number[] = [0, 0.25, 0.5, 0.75, 1];

export function likert(labels?: readonly string[]): readonly AnswerOption[] {
  const l = labels ?? DEFAULT_LIKERT;
  return INTENSITIES.map((intensity, i) => ({
    label: l[i] ?? DEFAULT_LIKERT[i],
    intensity,
  }));
}

export const BINARY: readonly AnswerOption[] = [
  { label: "Never", intensity: 0 },
  { label: "Yes, at least once", intensity: 1 },
];

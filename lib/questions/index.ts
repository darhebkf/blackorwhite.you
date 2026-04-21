import type { Jurisdiction } from "@/lib/jurisdictions";
import type { Question } from "@/lib/scoring";
import { NL_QUESTIONS } from "./nl";

export { BINARY, likert } from "./likert";
export { NL_QUESTIONS } from "./nl";

export type QuizLength = "superfast" | "fast" | "classic";

const TARGETS: Record<QuizLength, number> = {
  superfast: 10,
  fast: 25,
  classic: 80,
};

const BANKS: Partial<Record<Jurisdiction, readonly Question[]>> = {
  nl: NL_QUESTIONS,
};

function pickForLength(
  bank: readonly Question[],
  length: QuizLength,
): readonly Question[] {
  const target = TARGETS[length];
  if (bank.length <= target) return bank;
  return bank.slice(0, target);
}

export function questionsFor(
  jurisdiction: Jurisdiction,
  length: QuizLength,
): readonly Question[] {
  const bank = BANKS[jurisdiction] ?? [];
  return pickForLength(bank, length);
}

export function authoredCount(jurisdiction: Jurisdiction): number {
  return BANKS[jurisdiction]?.length ?? 0;
}

export function targetCount(length: QuizLength): number {
  return TARGETS[length];
}

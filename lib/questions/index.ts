import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import lengthsRaw from "@/data/quiz-lengths.json";
import type { Jurisdiction } from "@/lib/jurisdictions";
import type { AnswerOption, Question } from "@/lib/scoring";

const DIR = join(process.cwd(), "data", "questions");

const LIKERT_DEFAULTS: readonly AnswerOption[] = [
  { label: "Never", intensity: 0 },
  { label: "Once or twice", intensity: 0.25 },
  { label: "Sometimes", intensity: 0.5 },
  { label: "Often", intensity: 0.75 },
  { label: "Routinely", intensity: 1 },
];

const BINARY_DEFAULTS: readonly AnswerOption[] = [
  { label: "Never", intensity: 0 },
  { label: "Yes, at least once", intensity: 1 },
];

type RawQuestion = Omit<Question, "answers"> & {
  answers?: readonly AnswerOption[];
};

function hydrate(raw: RawQuestion): Question {
  if (raw.answers && raw.answers.length > 0) return raw as Question;
  if (raw.format === "likert") return { ...raw, answers: LIKERT_DEFAULTS };
  if (raw.format === "binary") return { ...raw, answers: BINARY_DEFAULTS };
  throw new Error(
    `Question ${raw.id} has format "${raw.format}" but no answers`,
  );
}

function loadBanks(): Record<string, readonly Question[]> {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
  const banks: Record<string, readonly Question[]> = {};
  for (const file of files) {
    const id = file.replace(/\.json$/, "");
    const raw = readFileSync(join(DIR, file), "utf-8");
    const list = JSON.parse(raw) as readonly RawQuestion[];
    banks[id] = list.map(hydrate);
  }
  return banks;
}

const BANKS = loadBanks();

export type QuizLengthDescriptor = {
  id: string;
  label: string;
  percentage: number;
  minutes: string;
  blurb: string;
};

export const QUIZ_LENGTHS: readonly QuizLengthDescriptor[] =
  lengthsRaw as readonly QuizLengthDescriptor[];

export type QuizLength = (typeof QUIZ_LENGTHS)[number]["id"];

export function lengthById(id: QuizLength): QuizLengthDescriptor {
  const found = QUIZ_LENGTHS.find((l) => l.id === id);
  if (!found) throw new Error(`Unknown quiz length: ${id}`);
  return found;
}

function bankFor(jurisdiction: Jurisdiction): readonly Question[] {
  const bank = BANKS[jurisdiction];
  if (!bank)
    throw new Error(`No question bank for jurisdiction: ${jurisdiction}`);
  return bank;
}

export function targetCount(
  length: QuizLength,
  jurisdiction: Jurisdiction,
): number {
  const descriptor = lengthById(length);
  const bank = bankFor(jurisdiction);
  return Math.max(1, Math.ceil((bank.length * descriptor.percentage) / 100));
}

export function questionsFor(
  jurisdiction: Jurisdiction,
  length: QuizLength,
): readonly Question[] {
  const bank = bankFor(jurisdiction);
  const target = targetCount(length, jurisdiction);
  if (bank.length <= target) return bank;
  return bank.slice(0, target);
}

export function authoredCount(jurisdiction: Jurisdiction): number {
  return bankFor(jurisdiction).length;
}

export function isLive(jurisdiction: Jurisdiction): boolean {
  return BANKS[jurisdiction] !== undefined && BANKS[jurisdiction].length > 0;
}

export function liveJurisdictions(): readonly Jurisdiction[] {
  return Object.keys(BANKS).filter((id) => isLive(id));
}

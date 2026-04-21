import { bandForShade, shadeToColorCodes } from "@/lib/color";
import type { Jurisdiction } from "@/lib/jurisdictions";
import { ARCHETYPES } from "./archetypes";
import { AXIS_IDS } from "./axes";
import type { Answer, Archetype, AxisId, Question, QuizResult } from "./types";

function emptyAxes(): Record<AxisId, number> {
  const base = {} as Record<AxisId, number>;
  for (const id of AXIS_IDS) base[id] = 0;
  return base;
}

type Indexed = { question: Question; answer: Answer };

function indexAnswers(
  questions: readonly Question[],
  answers: readonly Answer[],
): Indexed[] {
  const byId = new Map<string, Question>();
  for (const q of questions) byId.set(q.id, q);
  const out: Indexed[] = [];
  for (const a of answers) {
    const question = byId.get(a.questionId);
    if (!question) continue;
    if (a.optionIndex < 0 || a.optionIndex >= question.answers.length) continue;
    out.push({ question, answer: a });
  }
  return out;
}

export function computeShade(
  questions: readonly Question[],
  answers: readonly Answer[],
  jurisdiction: Jurisdiction,
): number {
  if (answers.length === 0) return 100;
  const indexed = indexAnswers(questions, answers);

  let weightedSum = 0;
  let totalSeverity = 0;
  for (const { question, answer } of indexed) {
    const severity = question.severity[jurisdiction] ?? 0;
    if (severity === 0) continue;
    const option = question.answers[answer.optionIndex];
    weightedSum += option.intensity * severity;
    totalSeverity += severity;
  }

  if (totalSeverity === 0) return 100;
  return Math.round(100 * (1 - weightedSum / totalSeverity));
}

export function computeAxes(
  questions: readonly Question[],
  answers: readonly Answer[],
): Record<AxisId, number> {
  const sums = emptyAxes();
  const counts = emptyAxes();

  const indexed = indexAnswers(questions, answers);
  for (const { question, answer } of indexed) {
    const option = question.answers[answer.optionIndex];
    const axes = option.axes ?? question.axes ?? {};
    for (const axisId of AXIS_IDS) {
      const loading = axes[axisId];
      if (loading === undefined) continue;
      sums[axisId] += loading * option.intensity;
      counts[axisId] += Math.abs(loading);
    }
  }

  const result = emptyAxes();
  for (const axisId of AXIS_IDS) {
    result[axisId] = counts[axisId] === 0 ? 0 : sums[axisId] / counts[axisId];
  }
  return result;
}

function distance(
  a: Partial<Record<AxisId, number>>,
  b: Partial<Record<AxisId, number>>,
): number {
  let sum = 0;
  for (const id of AXIS_IDS) {
    const av = a[id] ?? 0;
    const bv = b[id] ?? 0;
    const d = av - bv;
    sum += d * d;
  }
  return Math.sqrt(sum);
}

export function matchArchetype(
  shade: number,
  axes: Record<AxisId, number>,
): Archetype {
  const window = 8;
  const candidates = ARCHETYPES.filter(
    (a) => Math.abs(a.shadeAnchor - shade) <= window,
  );
  const pool = candidates.length > 0 ? candidates : [...ARCHETYPES];
  let best = pool[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const candidate of pool) {
    const axisDist = distance(axes, candidate.axes);
    const shadeDist = Math.abs(candidate.shadeAnchor - shade) / 10;
    const score = axisDist + shadeDist;
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

export function score(
  questions: readonly Question[],
  answers: readonly Answer[],
  jurisdiction: Jurisdiction,
): QuizResult {
  const shade = computeShade(questions, answers, jurisdiction);
  const axes = computeAxes(questions, answers);
  const band = bandForShade(shade);
  const archetype = matchArchetype(shade, axes);
  const colorCodes = shadeToColorCodes(shade);
  return {
    shade,
    axes,
    band,
    archetype,
    colorCodes,
    answered: answers.length,
    total: questions.length,
  };
}

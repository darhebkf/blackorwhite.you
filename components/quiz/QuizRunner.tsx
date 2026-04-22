"use client";

import { useEffect, useMemo, useState } from "react";
import { ResultCard } from "@/components/result/ResultCard";
import {
  clearShadeCookie,
  reflectShade,
  resetShade,
  setShadeCookie,
} from "@/lib/browser";
import type { Jurisdiction } from "@/lib/jurisdictions";
import { type Answer, computeShade, type Question, score } from "@/lib/scoring";
import { ProgressMark } from "./ProgressMark";
import { QuestionCard } from "./QuestionCard";

type QuizRunnerProps = {
  questions: readonly Question[];
  jurisdiction: Jurisdiction;
};

type State = {
  step: number;
  answers: Record<string, number>;
};

function toAnswerList(answers: Record<string, number>): Answer[] {
  return Object.entries(answers).map(([questionId, optionIndex]) => ({
    questionId,
    optionIndex,
  }));
}

export function QuizRunner({ questions, jurisdiction }: QuizRunnerProps) {
  const [{ step, answers }, setState] = useState<State>({
    step: 0,
    answers: {},
  });

  const answerList = useMemo(() => toAnswerList(answers), [answers]);
  const done = step >= questions.length;

  const runningShade = useMemo(() => {
    if (done) return computeShade(questions, answerList, jurisdiction);
    return computeShade(questions, answerList, jurisdiction);
  }, [done, questions, answerList, jurisdiction]);

  useEffect(() => {
    reflectShade(runningShade);
    return () => {
      resetShade();
    };
  }, [runningShade]);

  const result = useMemo(
    () => (done ? score(questions, answerList, jurisdiction) : null),
    [done, questions, answerList, jurisdiction],
  );

  useEffect(() => {
    if (result) setShadeCookie(result.shade);
  }, [result]);

  const handleSelect = (optionIndex: number) => {
    const q = questions[step];
    setState((prev) => ({
      step: Math.min(prev.step + 1, questions.length),
      answers: { ...prev.answers, [q.id]: optionIndex },
    }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  const handleRetake = () => {
    clearShadeCookie();
    setState({ step: 0, answers: {} });
  };

  if (done && result) {
    return <ResultCard result={result} onRetake={handleRetake} />;
  }

  const q = questions[step];
  const selected = answers[q.id];

  return (
    <section className="flex flex-col">
      <ProgressMark index={step} total={questions.length} />
      <QuestionCard
        question={q}
        selected={selected}
        onSelect={handleSelect}
        onBack={step > 0 ? handleBack : undefined}
      />
    </section>
  );
}

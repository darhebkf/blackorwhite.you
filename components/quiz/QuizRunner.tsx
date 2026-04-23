"use client";

import { useEffect, useMemo, useState } from "react";
import { OwnerActions } from "@/components/result/OwnerActions";
import { ResultCard } from "@/components/result/ResultCard";
import {
  clearShadeCookie,
  reflectFromCookie,
  reflectShade,
  setShadeCookie,
} from "@/lib/browser";
import type { Figure } from "@/lib/figures";
import type { JurisdictionDescriptor } from "@/lib/jurisdictions";
import { type Answer, computeShade, type Question, score } from "@/lib/scoring";
import { ProgressMark } from "./ProgressMark";
import { QuestionCard } from "./QuestionCard";

type QuizRunnerProps = {
  questions: readonly Question[];
  jurisdiction: JurisdictionDescriptor;
  figures: readonly Figure[];
  authored: number;
  target: number;
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

export function QuizRunner({
  questions,
  jurisdiction,
  figures,
  authored,
  target,
}: QuizRunnerProps) {
  const [{ step, answers }, setState] = useState<State>({
    step: 0,
    answers: {},
  });

  const answerList = useMemo(() => toAnswerList(answers), [answers]);
  const done = step >= questions.length;

  const runningShade = useMemo(
    () => computeShade(questions, answerList, jurisdiction.id),
    [questions, answerList, jurisdiction.id],
  );

  useEffect(() => {
    reflectShade(runningShade);
  }, [runningShade]);

  useEffect(() => {
    return () => {
      void reflectFromCookie();
    };
  }, []);

  const result = useMemo(
    () => (done ? score(questions, answerList, jurisdiction.id) : null),
    [done, questions, answerList, jurisdiction.id],
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
    return (
      <ResultCard
        result={result}
        section="§ 004 · Result"
        figures={figures}
        jurisdictionAdjective={jurisdiction.adjective}
        actions={<OwnerActions result={result} onRetake={handleRetake} />}
      />
    );
  }

  const q = questions[step];
  const selected = answers[q.id];

  return (
    <section className="flex flex-col">
      <ProgressMark
        index={step}
        total={questions.length}
        shade={runningShade}
        authored={authored}
        target={target}
      />
      <QuestionCard
        question={q}
        selected={selected}
        onSelect={handleSelect}
        onBack={step > 0 ? handleBack : undefined}
      />
    </section>
  );
}

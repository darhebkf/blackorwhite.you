import type { Question } from "@/lib/scoring";

type QuestionCardProps = {
  question: Question;
  selected: number | undefined;
  onSelect: (optionIndex: number) => void;
  onBack?: () => void;
};

const FORMAT_LABEL: Record<Question["format"], string> = {
  likert: "Frequency · Likert",
  binary: "Ever · Yes/No",
  scenario: "Scenario · Single choice",
};

export function QuestionCard({
  question,
  selected,
  onSelect,
  onBack,
}: QuestionCardProps) {
  return (
    <section className="flex flex-col">
      <div className="px-[var(--gutter)] pt-12 pb-10 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-6">
          <span className="eyebrow">{FORMAT_LABEL[question.format]}</span>
          {question.citation?.nl && (
            <span
              className="eyebrow mono-nums hidden sm:inline"
              style={{ opacity: 0.6 }}
            >
              Cite · {question.citation.nl.statute}
            </span>
          )}
        </div>
        <h2
          className="font-bold leading-tight tracking-tight"
          style={{
            fontSize: "var(--step-4)",
            lineHeight: 1.1,
            maxWidth: "24ch",
          }}
        >
          {question.prompt}
        </h2>
      </div>

      <ul className="hairline-top">
        {question.answers.map((option, i) => {
          const isSelected = selected === i;
          return (
            <li key={option.label} className="hairline-bot">
              <button
                type="button"
                onClick={() => onSelect(i)}
                className="group w-full text-left grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 px-[var(--gutter)] py-6 invert-on-hover cursor-pointer"
                style={
                  isSelected
                    ? { background: "var(--fg)", color: "var(--bg)" }
                    : undefined
                }
                aria-pressed={isSelected}
              >
                <span
                  className="mono-nums font-bold"
                  style={{ fontSize: "var(--step-0)" }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className="font-bold tracking-tight"
                  style={{ fontSize: "var(--step-2)" }}
                >
                  {option.label}
                </span>
                <span
                  className="mono-nums"
                  style={{ fontSize: "var(--step--1)", opacity: 0.75 }}
                >
                  {isSelected ? "✓" : "→"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {onBack && (
        <div className="px-[var(--gutter)] py-6 flex items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            className="eyebrow group relative inline-block pb-[2px] cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            ← Previous question
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 bottom-0 h-px w-full bg-current transition-all duration-300 group-hover:w-0 group-focus-visible:w-0"
            />
          </button>
        </div>
      )}
    </section>
  );
}

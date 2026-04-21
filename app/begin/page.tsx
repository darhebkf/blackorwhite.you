import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import {
  DEFAULT_JURISDICTION,
  isLive,
  type Jurisdiction,
} from "@/lib/jurisdictions";
import {
  authoredCount,
  type QuizLength,
  questionsFor,
  targetCount,
} from "@/lib/questions";

type BeginPageProps = {
  searchParams: Promise<{ len?: string; juris?: string }>;
};

const VALID_LENGTHS: readonly QuizLength[] = ["superfast", "fast", "classic"];

function parseLength(raw: string | undefined): QuizLength {
  if (raw && VALID_LENGTHS.includes(raw as QuizLength))
    return raw as QuizLength;
  return "fast";
}

function parseJurisdiction(raw: string | undefined): Jurisdiction {
  if (!raw) return DEFAULT_JURISDICTION;
  if (isLive(raw as Jurisdiction)) return raw as Jurisdiction;
  return DEFAULT_JURISDICTION;
}

export default async function Begin({ searchParams }: BeginPageProps) {
  const params = await searchParams;
  const length = parseLength(params.len);
  const juris = parseJurisdiction(params.juris);

  const questions = questionsFor(juris, length);
  const authored = authoredCount(juris);
  const target = targetCount(length);
  const shortfall = authored < target;

  return (
    <main className="min-h-dvh flex flex-col">
      <SiteHeader
        section={`§ 002 · ${length[0].toUpperCase()}${length.slice(1)}`}
      />

      {shortfall && (
        <div className="px-[var(--gutter)] py-3 hairline-bot">
          <p className="eyebrow" style={{ opacity: 0.7 }}>
            Beta · {authored} of {target} questions authored so far ·
            you&rsquo;ll see the ones that are live.
          </p>
        </div>
      )}

      {questions.length === 0 ? (
        <section className="flex-1 flex flex-col items-center justify-center gap-6 px-[var(--gutter)]">
          <p className="eyebrow">
            No questions authored yet for this jurisdiction.
          </p>
          <Link href="/" className="hairline invert-on-hover px-6 py-3 eyebrow">
            ← Back
          </Link>
        </section>
      ) : (
        <QuizRunner questions={questions} jurisdiction={juris} />
      )}

      <SiteFooter mark={`§ 002 — Quiz · ${length}`} />
    </main>
  );
}

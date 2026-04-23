import Link from "next/link";
import { notFound } from "next/navigation";
import { JurisdictionPicker } from "@/components/jurisdiction/JurisdictionPicker";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { FIGURES } from "@/lib/figures/server";
import {
  DEFAULT_JURISDICTION,
  JURISDICTIONS,
  type Jurisdiction,
  jurisdictionById,
} from "@/lib/jurisdictions";
import {
  authoredCount,
  isLive,
  liveJurisdictions,
  QUIZ_LENGTHS,
  type QuizLength,
  questionsFor,
  targetCount,
} from "@/lib/questions";

type BeginPageProps = {
  searchParams: Promise<{ len?: string; juris?: string }>;
};

function parseLength(raw: string | undefined): QuizLength {
  if (!raw) return "fast";
  if (QUIZ_LENGTHS.some((l) => l.id === raw)) return raw;
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
  const target = targetCount(length, juris);
  const jurisdictionDescriptor = jurisdictionById(juris);
  if (!jurisdictionDescriptor) notFound();

  return (
    <main className="min-h-dvh flex flex-col">
      <SiteHeader
        section={`§ 002 · ${length[0].toUpperCase()}${length.slice(1)}`}
      />

      <JurisdictionPicker
        current={juris}
        options={JURISDICTIONS}
        liveIds={liveJurisdictions()}
      />

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
        <QuizRunner
          questions={questions}
          jurisdiction={jurisdictionDescriptor}
          figures={FIGURES}
          authored={authored}
          target={target}
        />
      )}

      <SiteFooter mark={`§ 002 — Quiz · ${length}`} />
    </main>
  );
}

import Link from "next/link";

type QuizLength = "superfast" | "fast" | "classic";

type Choice = {
  slug: QuizLength;
  label: string;
  count: number;
  minutes: string;
  blurb: string;
};

const CHOICES: readonly Choice[] = [
  {
    slug: "superfast",
    label: "Superfast",
    count: 10,
    minutes: "≈ 2 min",
    blurb: "broad strokes",
  },
  {
    slug: "fast",
    label: "Fast",
    count: 25,
    minutes: "≈ 5 min",
    blurb: "representative",
  },
  {
    slug: "classic",
    label: "Classic",
    count: 60,
    minutes: "≈ 12 min",
    blurb: "the whole rubric",
  },
] as const;

export function BeginChoices() {
  return (
    <section className="hairline-top">
      <div className="flex items-center justify-between px-[var(--gutter)] py-4 hairline-bot">
        <span className="eyebrow">Choose your depth</span>
        <span className="eyebrow mono-nums">3 · versions</span>
      </div>
      <ul>
        {CHOICES.map((c) => (
          <li key={c.slug} className="hairline-bot">
            <Link
              href={`/begin?len=${c.slug}`}
              className="group grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 px-[var(--gutter)] py-7 invert-on-hover"
            >
              <span
                className="font-black uppercase tracking-tight"
                style={{ fontSize: "var(--step-3)" }}
              >
                {c.label}
              </span>
              <span
                className="italic-accent hidden md:block"
                style={{ fontSize: "var(--step-0)" }}
              >
                {c.blurb} · {c.minutes}
              </span>
              <span
                className="mono-nums font-bold"
                style={{ fontSize: "var(--step-3)" }}
              >
                → {String(c.count).padStart(2, "0")}
              </span>
              <span
                className="italic-accent md:hidden col-span-2 -mt-1"
                style={{ fontSize: "var(--step--1)", opacity: 0.75 }}
              >
                {c.blurb} · {c.minutes}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

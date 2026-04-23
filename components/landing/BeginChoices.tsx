import Link from "next/link";
import { DEFAULT_JURISDICTION } from "@/lib/jurisdictions";
import { QUIZ_LENGTHS, targetCount } from "@/lib/questions";

export function BeginChoices() {
  return (
    <section className="hairline-top">
      <div className="flex items-center justify-between px-[var(--gutter)] py-4 hairline-bot">
        <span className="eyebrow">Choose your depth</span>
        <span className="eyebrow mono-nums">
          {QUIZ_LENGTHS.length} · versions
        </span>
      </div>
      <ul>
        {QUIZ_LENGTHS.map((length) => {
          const count = targetCount(length.id, DEFAULT_JURISDICTION);
          return (
            <li key={length.id} className="hairline-bot">
              <Link
                href={`/begin?len=${length.id}`}
                className="group grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 px-[var(--gutter)] py-7 invert-on-hover"
              >
                <span
                  className="font-black uppercase tracking-tight"
                  style={{ fontSize: "var(--step-3)" }}
                >
                  {length.label}
                </span>
                <span
                  className="italic-accent hidden md:block"
                  style={{ fontSize: "var(--step-0)" }}
                >
                  {length.blurb} · {length.minutes}
                </span>
                <span
                  className="mono-nums font-bold"
                  style={{ fontSize: "var(--step-3)" }}
                >
                  → {String(count).padStart(2, "0")}
                </span>
                <span
                  className="italic-accent md:hidden col-span-2 -mt-1"
                  style={{ fontSize: "var(--step--1)", opacity: 0.75 }}
                >
                  {length.blurb} · {length.minutes}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

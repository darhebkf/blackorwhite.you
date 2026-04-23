import type { ReactNode } from "react";
import { type Figure, nearestMixed } from "@/lib/figures";
import type { QuizResult } from "@/lib/scoring";
import { AXES } from "@/lib/scoring";

type ResultCardProps = {
  result: QuizResult;
  actions: ReactNode;
  section: string;
  figures: readonly Figure[];
  jurisdictionAdjective: string;
  originLabel?: string;
};

const SWIPE_LINK = "group relative inline-block pb-[1px] no-underline";
const SWIPE_UNDERLINE =
  "pointer-events-none absolute left-0 bottom-0 h-px w-full bg-current transition-all duration-300 group-hover:w-0 group-focus-visible:w-0";

export function ResultCard({
  result,
  actions,
  section,
  figures,
  jurisdictionAdjective,
  originLabel,
}: ResultCardProps) {
  const { shade, axes, band, archetype, colorCodes } = result;
  const countLabel =
    result.total > 0
      ? `${result.answered} / ${result.total} answered`
      : undefined;
  const topRight = originLabel ?? countLabel;
  const nearby = nearestMixed(figures, shade, 2, 2);

  return (
    <section className="flex flex-col">
      <div className="px-[var(--gutter)] pt-10 pb-6 hairline-bot flex items-center justify-between">
        <span className="eyebrow">{section}</span>
        {topRight && <span className="eyebrow mono-nums">{topRight}</span>}
      </div>

      <div className="grid grid-cols-12 gap-[var(--gutter)] px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)]">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-10">
          <div>
            <p className="eyebrow mb-6">Your shade</p>
            <div className="flex items-baseline gap-6 flex-wrap">
              <span
                className="mono-nums font-black tracking-tighter"
                style={{
                  fontSize: "clamp(5rem, 3rem + 12vw, 16rem)",
                  lineHeight: 0.85,
                }}
              >
                {String(shade).padStart(2, "0")}
              </span>
              <span
                className="italic-accent"
                style={{ fontSize: "var(--step-3)", lineHeight: 1 }}
              >
                {band.name}
              </span>
            </div>
            <p className="eyebrow mt-4" style={{ opacity: 0.65 }}>
              Measured under {jurisdictionAdjective} law
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-[52ch]">
            <p
              className="font-bold"
              style={{ fontSize: "var(--step-3)", lineHeight: 1.05 }}
            >
              {archetype.name}
            </p>
            <p
              className="italic-accent"
              style={{ fontSize: "var(--step-1)", lineHeight: 1.4 }}
            >
              {archetype.blurb}
            </p>
          </div>

          {nearby.length > 0 && (
            <div className="flex flex-col gap-3 max-w-[60ch]">
              <span className="eyebrow" style={{ opacity: 0.7 }}>
                Near your shade
              </span>
              <ul className="flex flex-col">
                {nearby.map((figure) => (
                  <li
                    key={figure.id}
                    className="grid grid-cols-[3rem_1fr] gap-x-5 py-4 hairline-top"
                  >
                    <span
                      className="mono-nums font-black"
                      style={{
                        fontSize: "var(--step-2)",
                        lineHeight: 1,
                      }}
                    >
                      {String(figure.shade).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span
                          className="font-bold tracking-tight"
                          style={{ fontSize: "var(--step-1)" }}
                        >
                          {figure.name}
                        </span>
                        <span className="eyebrow" style={{ opacity: 0.55 }}>
                          {figure.kind}
                          {figure.work ? ` · ${figure.work}` : ""}
                        </span>
                      </div>
                      <p
                        className="italic-accent"
                        style={{
                          fontSize: "var(--step-0)",
                          lineHeight: 1.45,
                        }}
                      >
                        {figure.rationale}
                      </p>
                      {figure.citation && (
                        <p className="eyebrow mt-1" style={{ opacity: 0.7 }}>
                          {figure.citationUrl ? (
                            <a
                              href={figure.citationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={SWIPE_LINK}
                            >
                              ↗ {figure.citation}
                              <span aria-hidden className={SWIPE_UNDERLINE} />
                            </a>
                          ) : (
                            figure.citation
                          )}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actions}
        </div>

        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="eyebrow" style={{ opacity: 0.7 }}>
              Color codes
            </span>
            <dl
              className="flex flex-col gap-2 mono-nums"
              style={{ fontSize: "var(--step-0)" }}
            >
              <CodeRow k="HEX" v={colorCodes.hex} />
              <CodeRow k="RGB" v={colorCodes.rgb} />
              <CodeRow k="HSL" v={colorCodes.hsl} />
              <CodeRow k="OKLCH" v={colorCodes.oklch} />
            </dl>
          </div>

          <div className="flex flex-col gap-3">
            <span className="eyebrow" style={{ opacity: 0.7 }}>
              Axes
            </span>
            <ul className="flex flex-col gap-4">
              {AXES.map((axis) => {
                const v = axes[axis.id];
                const pct = Math.round(((v + 1) / 2) * 100);
                return (
                  <li key={axis.id} className="flex flex-col gap-1">
                    <div
                      className="flex items-baseline justify-between"
                      style={{ fontSize: "var(--step--1)" }}
                    >
                      <span>{axis.negativeLabel}</span>
                      <span style={{ opacity: 0.6 }}>{axis.positiveLabel}</span>
                    </div>
                    <div
                      className="w-full h-[3px] relative"
                      style={{ background: "var(--rule)", opacity: 0.2 }}
                    >
                      <div
                        className="absolute top-0 bottom-0"
                        style={{
                          left: pct < 50 ? `${pct}%` : "50%",
                          width: pct < 50 ? `${50 - pct}%` : `${pct - 50}%`,
                          background: "var(--rule)",
                          opacity: 1,
                        }}
                      />
                      <div
                        className="absolute top-[-2px] bottom-[-2px] w-[2px]"
                        style={{
                          left: "50%",
                          background: "var(--rule)",
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CodeRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 hairline-bot pb-2">
      <dt className="eyebrow">{k}</dt>
      <dd className="mono-nums">{v}</dd>
    </div>
  );
}

import Link from "next/link";
import { generateFaviconBlob } from "@/lib/browser";
import type { QuizResult } from "@/lib/scoring";
import { AXES } from "@/lib/scoring";

type ResultCardProps = {
  result: QuizResult;
  onRetake: () => void;
};

async function downloadIcon(shade: number, archetypeId: string): Promise<void> {
  const blob = await generateFaviconBlob(shade);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `blackorwhite-${String(shade).padStart(3, "0")}-${archetypeId}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ResultCard({ result, onRetake }: ResultCardProps) {
  const { shade, axes, band, archetype, colorCodes } = result;

  return (
    <section className="flex flex-col">
      <div className="px-[var(--gutter)] pt-10 pb-6 hairline-bot flex items-center justify-between">
        <span className="eyebrow">§ 004 · Result</span>
        <span className="eyebrow mono-nums">
          {result.answered} / {result.total} answered
        </span>
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="hairline invert-on-hover px-6 py-3 eyebrow"
            >
              ↻ Retake
            </button>
            <button
              type="button"
              onClick={() => downloadIcon(shade, archetype.id)}
              className="hairline invert-on-hover px-6 py-3 eyebrow"
            >
              ↓ Download icon
            </button>
            <Link
              href="/"
              className="hairline invert-on-hover px-6 py-3 eyebrow"
            >
              ← Landing
            </Link>
            <Link
              href="/methodology"
              className="hairline invert-on-hover px-6 py-3 eyebrow"
            >
              → Methodology
            </Link>
          </div>
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

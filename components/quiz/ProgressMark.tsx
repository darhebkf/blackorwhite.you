import { shadeToHex } from "@/lib/color";

type ProgressMarkProps = {
  index: number;
  total: number;
  shade: number;
  authored: number;
  target: number;
};

const IS_DEV = process.env.NODE_ENV === "development";

export function ProgressMark({
  index,
  total,
  shade,
  authored,
  target,
}: ProgressMarkProps) {
  const pad = String(total).length;
  const current = String(Math.min(index + 1, total)).padStart(pad, "0");
  const end = String(total).padStart(pad, "0");
  const pct = Math.min(100, Math.round((index / total) * 100));
  const hex = shadeToHex(shade);
  const shortfall = authored < target;

  return (
    <div className="flex flex-col">
      {IS_DEV && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-[var(--gutter)] py-3 eyebrow hairline-bot">
          <span className="mono-nums font-bold" style={{ opacity: 0.8 }}>
            DEV
          </span>
          <span className="mono-nums">
            shade{" "}
            <span className="font-bold">{String(shade).padStart(2, "0")}</span>{" "}
            · {hex}
          </span>
          {shortfall && (
            <span className="mono-nums" style={{ opacity: 0.8 }}>
              beta · {authored} / {target} authored
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 px-[var(--gutter)] py-5 hairline-bot">
        <div className="flex items-center justify-between gap-x-6 gap-y-2 flex-wrap">
          <span className="eyebrow">
            Question <span className="mono-nums">{current}</span> /{" "}
            <span className="mono-nums">{end}</span>
          </span>
          <span className="eyebrow mono-nums">{pct}%</span>
        </div>
        <div
          className="w-full h-[2px]"
          style={{ background: "var(--rule)", opacity: 0.2 }}
        >
          <div
            className="h-full"
            style={{
              width: `${pct}%`,
              background: "var(--rule)",
              transition: "width 320ms var(--ease)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

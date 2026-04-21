type ProgressMarkProps = {
  index: number;
  total: number;
};

export function ProgressMark({ index, total }: ProgressMarkProps) {
  const pad = String(total).length;
  const current = String(Math.min(index + 1, total)).padStart(pad, "0");
  const end = String(total).padStart(pad, "0");
  const pct = Math.min(100, Math.round((index / total) * 100));

  return (
    <div className="flex flex-col gap-3 px-[var(--gutter)] py-5 hairline-bot">
      <div className="flex items-center justify-between">
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
  );
}

import Link from "next/link";

export function SpectrumLegend() {
  return (
    <aside
      className={[
        "col-span-12 lg:col-span-4",
        "flex flex-col justify-between gap-10",
        "pt-10 lg:pt-0 mt-6 lg:mt-0",
        "border-t-2 lg:border-t-0 lg:border-l-2 border-[var(--rule)]",
        "lg:pl-[var(--gutter)]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-5">
        <span className="eyebrow" style={{ opacity: 0.7 }}>
          Spectrum
        </span>

        <div className="flex items-baseline gap-4">
          <span
            className="mono-nums font-black"
            style={{ fontSize: "var(--step-5)" }}
          >
            000
          </span>
          <span className="italic-accent" style={{ fontSize: "var(--step-0)" }}>
            total black
          </span>
        </div>

        <div className="rule-line" />

        <div className="flex items-baseline gap-4">
          <span
            className="mono-nums font-black"
            style={{ fontSize: "var(--step-5)" }}
          >
            100
          </span>
          <span className="italic-accent" style={{ fontSize: "var(--step-0)" }}>
            total white
          </span>
        </div>

        <p
          className="italic-accent"
          style={{ fontSize: "var(--step--1)", lineHeight: 1.5, opacity: 0.8 }}
        >
          Everyone you know is somewhere in between, whether they admit it or
          not.
        </p>
      </div>

      <div
        className="eyebrow flex flex-col gap-3"
        style={{ opacity: 0.7, lineHeight: 1.6 }}
      >
        <span>Sources</span>
        <span>Wetboek van Strafrecht</span>
        <span>ICCPR · Rome Statute</span>
        <span>AVG / GDPR</span>
        <Link
          href="/methodology"
          className="group relative self-start inline-block pb-1"
          style={{ textDecoration: "none" }}
        >
          → Full rubric
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 bottom-0 h-px w-full bg-current transition-all duration-300 group-hover:w-0 group-focus-visible:w-0"
          />
        </Link>
      </div>
    </aside>
  );
}

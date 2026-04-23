"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { JurisdictionDescriptor } from "@/lib/jurisdictions";

type JurisdictionPickerProps = {
  current: string;
  options: readonly JurisdictionDescriptor[];
  liveIds: readonly string[];
};

export function JurisdictionPicker({
  current,
  options,
  liveIds,
}: JurisdictionPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const liveSet = new Set(liveIds);

  const currentOption = options.find((o) => o.id === current);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (id: string) => {
    if (!liveSet.has(id)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("juris", id);
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative hairline-bot">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center justify-between w-full px-[var(--gutter)] py-4 invert-on-hover text-left"
      >
        <span className="flex flex-col items-start gap-1">
          <span className="eyebrow" style={{ opacity: 0.65 }}>
            Jurisdiction
          </span>
          <span
            className="font-bold tracking-tight"
            style={{ fontSize: "var(--step-1)" }}
          >
            {currentOption?.label ?? "—"}
          </span>
        </span>
        <span
          className="mono-nums"
          style={{
            fontSize: "var(--step-1)",
            transition: "transform 240ms var(--ease)",
            transform: open ? "rotate(180deg)" : "none",
          }}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Jurisdiction options"
          className="absolute top-full left-0 right-0 z-20 flex flex-col hairline max-h-[70vh] overflow-y-auto"
          style={{ background: "var(--bg)", color: "var(--fg)" }}
        >
          {options.map((opt) => {
            const isLive = liveSet.has(opt.id);
            const isCurrent = opt.id === current;
            const baseClasses =
              "grid grid-cols-[3rem_1fr_auto] gap-x-5 items-baseline px-[var(--gutter)] py-4 hairline-bot text-left w-full";
            return isLive ? (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isCurrent}
                className={`${baseClasses} cursor-pointer invert-on-hover`}
                onClick={() => select(opt.id)}
              >
                <span className="eyebrow mono-nums">{opt.shortLabel}</span>
                <span className="flex flex-col gap-1">
                  <span
                    className={
                      isCurrent
                        ? "font-black tracking-tight"
                        : "font-bold tracking-tight"
                    }
                    style={{ fontSize: "var(--step-0)" }}
                  >
                    {opt.label}
                  </span>
                  {opt.note && (
                    <span
                      className="italic-accent"
                      style={{ fontSize: "var(--step--1)", opacity: 0.65 }}
                    >
                      {opt.note}
                    </span>
                  )}
                </span>
                <span className="eyebrow" style={{ opacity: 0.75 }}>
                  {isCurrent ? "✓ selected" : "available"}
                </span>
              </button>
            ) : (
              <div
                key={opt.id}
                role="option"
                aria-selected={false}
                aria-disabled
                tabIndex={-1}
                className={`${baseClasses} cursor-not-allowed`}
                style={{ opacity: 0.45 }}
              >
                <span className="eyebrow mono-nums">{opt.shortLabel}</span>
                <span className="flex flex-col gap-1">
                  <span
                    className="font-bold tracking-tight"
                    style={{ fontSize: "var(--step-0)" }}
                  >
                    {opt.label}
                  </span>
                  {opt.note && (
                    <span
                      className="italic-accent"
                      style={{ fontSize: "var(--step--1)", opacity: 0.65 }}
                    >
                      {opt.note}
                    </span>
                  )}
                </span>
                <span className="eyebrow" style={{ opacity: 0.75 }}>
                  coming soon
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

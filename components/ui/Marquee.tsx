"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  gap?: number;
  ariaLabel?: string;
  className?: string;
};

export function Marquee({
  children,
  speed = 50,
  gap = 40,
  ariaLabel = "Marquee",
  className,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [seqWidth, setSeqWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      const containerW = containerRef.current?.clientWidth ?? 0;
      const seqW = seqRef.current?.getBoundingClientRect().width ?? 0;
      if (seqW > 0) {
        setSeqWidth(seqW);
        setCopies(Math.max(2, Math.ceil(containerW / seqW) + 2));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let raf = 0;
    let last = 0;
    let offset = 0;
    const step = (ts: number) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      offset = (offset + speed * dt) % seqWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed, seqWidth]);

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`.trim()}
      aria-label={ariaLabel}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {Array.from({ length: copies }, (_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: positional duplicates with no identity
            key={`copy-${i}`}
            ref={i === 0 ? seqRef : undefined}
            className="flex shrink-0"
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
            aria-hidden={i > 0}
          >
            {children}
          </div>
        ))}
      </div>
    </section>
  );
}

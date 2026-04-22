"use client";

import Link from "next/link";
import { useState } from "react";
import { generateFaviconBlob } from "@/lib/browser";
import type { QuizResult } from "@/lib/scoring";
import { encodeResult } from "@/lib/share";

type OwnerActionsProps = {
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

export function OwnerActions({ result, onRetake }: OwnerActionsProps) {
  const [copied, setCopied] = useState(false);

  const share = async (): Promise<void> => {
    const slug = encodeResult(result);
    const url = `${window.location.origin}/r/${slug}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Shade ${String(result.shade).padStart(2, "0")} · ${result.archetype.name}`,
          text: `I landed on ${result.archetype.name} (${result.band.name}).`,
          url,
        });
        return;
      } catch {
        // user canceled — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={share}
        className="hairline invert-on-hover px-6 py-3 eyebrow"
      >
        {copied ? "✓ Copied" : "↗ Share"}
      </button>
      <button
        type="button"
        onClick={onRetake}
        className="hairline invert-on-hover px-6 py-3 eyebrow"
      >
        ↻ Retake
      </button>
      <button
        type="button"
        onClick={() => downloadIcon(result.shade, result.archetype.id)}
        className="hairline invert-on-hover px-6 py-3 eyebrow"
      >
        ↓ Download icon
      </button>
      <Link href="/" className="hairline invert-on-hover px-6 py-3 eyebrow">
        ← Landing
      </Link>
      <Link
        href="/methodology"
        className="hairline invert-on-hover px-6 py-3 eyebrow"
      >
        → Methodology
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuizResult } from "@/lib/scoring";
import { buildShareMessage } from "@/lib/share";

type SharedActionsProps = {
  result: Pick<QuizResult, "shade" | "archetype" | "band">;
};

export function SharedActions({ result }: SharedActionsProps) {
  const [copied, setCopied] = useState(false);

  const reshare = async (): Promise<void> => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const message = buildShareMessage(result, url, "third-person");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: message.title,
          text: message.text,
          url,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(message.clipboard);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/begin?len=fast"
        className="hairline invert-on-hover px-6 py-3 eyebrow"
      >
        → Take it yourself
      </Link>
      <button
        type="button"
        onClick={reshare}
        className="hairline invert-on-hover px-6 py-3 eyebrow"
      >
        {copied ? "✓ Copied" : "↗ Re-share"}
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

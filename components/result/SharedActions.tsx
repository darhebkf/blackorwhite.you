"use client";

import Link from "next/link";
import { useState } from "react";

export function SharedActions() {
  const [copied, setCopied] = useState(false);

  const reshare = async (): Promise<void> => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
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

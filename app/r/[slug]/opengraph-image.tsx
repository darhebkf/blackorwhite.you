import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { bandForShade, shadeToHex } from "@/lib/color";
import { jurisdictionById } from "@/lib/jurisdictions";
import { decodeResult } from "@/lib/share";

export const alt = "BLACK or WHITE — how gray are you.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OGProps = {
  params: Promise<{ slug: string }>;
};

export default async function OG({ params }: OGProps) {
  const { slug } = await params;
  const result = decodeResult(slug);

  const root = process.cwd();
  const gothamBlack = await readFile(
    join(root, "public/fonts/GothamBlack.ttf"),
  );
  const gothamMedium = await readFile(
    join(root, "public/fonts/GothamMedium.ttf"),
  );

  const fonts = [
    {
      name: "Gotham" as const,
      data: gothamBlack,
      weight: 900 as const,
      style: "normal" as const,
    },
    {
      name: "Gotham" as const,
      data: gothamMedium,
      weight: 500 as const,
      style: "normal" as const,
    },
  ];

  if (!result) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #000000 50%, #000000 100%)",
          fontFamily: "Gotham",
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: -3,
            color: "#000000",
          }}
        >
          BLACK or WHITE
        </span>
        <span
          style={{
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: -0.5,
            color: "#ffffff",
            marginTop: 12,
          }}
        >
          — how gray are you.
        </span>
      </div>,
      { ...size, fonts },
    );
  }

  const shade = result.shade;
  const fill = shadeToHex(shade);
  const fg = shade > 55 ? "#000000" : "#ffffff";
  const mute = shade > 55 ? "rgba(0, 0, 0, 0.55)" : "rgba(255, 255, 255, 0.55)";
  const band = bandForShade(shade);
  const jurisdiction = jurisdictionById(result.jurisdiction);
  const jurisdictionShort =
    jurisdiction?.shortLabel ?? result.jurisdiction.toUpperCase();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: fill,
        color: fg,
        fontFamily: "Gotham",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        <span>blackorwhite.you</span>
        <span>Ed. I · {jurisdictionShort}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span
          style={{
            fontSize: 320,
            fontWeight: 900,
            letterSpacing: -8,
            lineHeight: 0.82,
          }}
        >
          {String(shade).padStart(2, "0")}
        </span>
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          {result.archetype.name}
        </span>
        <span
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: mute,
          }}
        >
          {band.name}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          width: "100%",
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.5 }}>
          — how gray are you.
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: mute,
          }}
        >
          a moral cartography
        </span>
      </div>
    </div>,
    { ...size, fonts },
  );
}

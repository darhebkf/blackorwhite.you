import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { SHADE_COOKIE, VIEW_COOKIE } from "@/lib/browser/cookie";
import { shadeToHex, themeFor } from "@/lib/color";
import "./globals.css";

const display = localFont({
  src: [
    { path: "../public/fonts/GothamLight.ttf", weight: "300", style: "normal" },
    {
      path: "../public/fonts/GothamMedium.ttf",
      weight: "500",
      style: "normal",
    },
    { path: "../public/fonts/GothamBold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/GothamBlack.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-display-raw",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif-raw",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-raw",
  display: "swap",
});

async function readShadeServer(): Promise<number> {
  const store = await cookies();
  const raw =
    store.get(VIEW_COOKIE)?.value ?? store.get(SHADE_COOKIE)?.value ?? "100";
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return 100;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export const metadata: Metadata = {
  title: "BLACK or WHITE — how gray are you.",
  description:
    "Everyone operates in the gray area. Tax workarounds, weed, speeding, white lies, civil disobedience, piracy — all of it. Twenty-four questions from criminal law and international treaties measure exactly how much of the gray you live in, and hand you back a shade, a color code, and a place on the spectrum. Nothing leaves your device.",
  applicationName: "blackorwhite.you",
  keywords: [
    "gray area",
    "moral gray area",
    "legal gray area",
    "how gray are you",
    "moral spectrum",
    "legal spectrum quiz",
    "ethics quiz",
    "NL",
    "Netherlands",
    "international law",
  ],
  openGraph: {
    title: "BLACK or WHITE — how gray are you.",
    description:
      "Everyone operates in the gray area. Answer and receive your shade.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BLACK or WHITE — how gray are you.",
    description:
      "Everyone operates in the gray area. Answer and receive your shade.",
  },
};

export async function generateViewport(): Promise<Viewport> {
  const shade = await readShadeServer();
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: shadeToHex(shade),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shade = await readShadeServer();
  const theme = themeFor(shade);
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${mono.variable}`}
      style={
        {
          "--bg": theme.bg,
          "--fg": theme.fg,
          "--rule": theme.rule,
          "--shade": String(shade),
        } as React.CSSProperties
      }
    >
      <body className="grain">{children}</body>
    </html>
  );
}

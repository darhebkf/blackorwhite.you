import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "BLACK or WHITE — how gray are you.",
  description:
    "Everyone operates in the gray area. Tax workarounds, weed, speeding, white lies, civil disobedience, piracy — all of it. Twenty-four questions from Dutch criminal law and international treaties measure exactly how much of the gray you live in, and hand you back a shade, a color code, and a place on the spectrum. Nothing leaves your device.",
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
      "Everyone operates in the gray area. Twenty-four questions measure exactly how much.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}

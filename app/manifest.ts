import type { MetadataRoute } from "next";
import { shadeToHex } from "@/lib/color";
import { shadeFromCookie } from "@/lib/og/shadeIcon";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const shade = await shadeFromCookie();
  const hex = shadeToHex(shade);
  const v = `v=${shade}`;

  return {
    id: "/",
    name: "BLACK or WHITE — how gray are you",
    short_name: "blackorwhite",
    description:
      "Everyone operates in the gray area. Answer and receive your shade — a color code, a named band, an archetype. Nothing leaves your device.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    dir: "ltr",
    categories: ["lifestyle", "personalization", "entertainment"],
    background_color: hex,
    theme_color: hex,
    icons: [
      {
        src: `/icon?${v}`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `/icon1?${v}`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `/icon2?${v}`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `/icon3?${v}`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: `/apple-icon?${v}`, sizes: "180x180", type: "image/png" },
    ],
  };
}

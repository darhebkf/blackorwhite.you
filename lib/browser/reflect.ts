import { shadeToHex, themeFor } from "@/lib/color";
import { readShadeFromCookies } from "./cookie";
import { generateFaviconDataUrl } from "./favicon";

const DYNAMIC_ICON_ATTR = "data-bow-dynamic";

function setMetaThemeColor(hex: string): void {
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", hex);
}

function setDynamicFavicon(dataUrl: string): void {
  let link = document.querySelector<HTMLLinkElement>(
    `link[rel="icon"][${DYNAMIC_ICON_ATTR}]`,
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.setAttribute(DYNAMIC_ICON_ATTR, "");
    document.head.appendChild(link);
  }
  link.setAttribute("href", dataUrl);
}

function removeDynamicFavicon(): void {
  const link = document.querySelector<HTMLLinkElement>(
    `link[rel="icon"][${DYNAMIC_ICON_ATTR}]`,
  );
  link?.remove();
}

export function reflectShade(shade: number): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const theme = themeFor(shade);
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--fg", theme.fg);
  root.style.setProperty("--rule", theme.rule);
  root.style.setProperty("--shade", String(shade));
  setMetaThemeColor(shadeToHex(shade));
  const icon = generateFaviconDataUrl(shade);
  if (icon) setDynamicFavicon(icon);
}

export function resetShade(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.removeProperty("--bg");
  root.style.removeProperty("--fg");
  root.style.removeProperty("--rule");
  root.style.removeProperty("--shade");
  setMetaThemeColor("#ffffff");
  removeDynamicFavicon();
}

export async function reflectFromCookie(): Promise<void> {
  if (typeof document === "undefined") return;
  const shade = await readShadeFromCookies();
  if (shade === 100) {
    resetShade();
    return;
  }
  reflectShade(shade);
}

export const SHADE_COOKIE = "bow-shade";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function setShadeCookie(shade: number): void {
  const v = Math.max(0, Math.min(100, Math.round(shade)));
  void globalThis.cookieStore?.set({
    name: SHADE_COOKIE,
    value: String(v),
    path: "/",
    sameSite: "lax",
    expires: Date.now() + ONE_YEAR_MS,
  });
}

export function clearShadeCookie(): void {
  void globalThis.cookieStore?.delete(SHADE_COOKIE);
}

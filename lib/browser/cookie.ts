export const SHADE_COOKIE = "bow-shade";
export const VIEW_COOKIE = "bow-view";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function clampShade(shade: number): number {
  return Math.max(0, Math.min(100, Math.round(shade)));
}

export function setShadeCookie(shade: number): void {
  void globalThis.cookieStore?.set({
    name: SHADE_COOKIE,
    value: String(clampShade(shade)),
    path: "/",
    sameSite: "lax",
    expires: Date.now() + ONE_YEAR_MS,
  });
}

export function clearShadeCookie(): void {
  void globalThis.cookieStore?.delete(SHADE_COOKIE);
}

export function setViewCookie(shade: number): void {
  void globalThis.cookieStore?.set({
    name: VIEW_COOKIE,
    value: String(clampShade(shade)),
    path: "/",
    sameSite: "lax",
  });
}

export function clearViewCookie(): void {
  void globalThis.cookieStore?.delete(VIEW_COOKIE);
}

export async function readShadeFromCookies(): Promise<number> {
  const store = globalThis.cookieStore;
  if (!store) return 100;
  const view = await store.get(VIEW_COOKIE);
  const og = await store.get(SHADE_COOKIE);
  const raw = view?.value ?? og?.value;
  if (!raw) return 100;
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return 100;
  return clampShade(parsed);
}

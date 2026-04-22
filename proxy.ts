import { type NextRequest, NextResponse } from "next/server";
import { VIEW_COOKIE } from "@/lib/browser/cookie";
import { decodeShadeOnly } from "@/lib/share";

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!slug) return NextResponse.next();

  const shade = decodeShadeOnly(slug);
  if (shade === null) return NextResponse.next();

  const value = String(shade);
  request.cookies.set(VIEW_COOKIE, value);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.cookies.set(VIEW_COOKIE, value, {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: "/r/:slug*",
};

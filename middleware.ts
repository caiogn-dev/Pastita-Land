// middleware.ts (na raiz do projeto)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore assets e APIs do Next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Se vier com maiúsculas (ex.: /Login), redireciona para minúsculas (/login)
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

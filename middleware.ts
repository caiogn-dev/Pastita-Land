import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;
  const setIf = (key: string) => {
    const val = url.searchParams.get(key);
    if (val) res.cookies.set(key, val, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  };
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(setIf);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

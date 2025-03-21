import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /movie/[id] to /movies/[id]
  if (pathname.startsWith("/movie/")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/movie/", "/movies/"), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/movie/:path*",
}; 
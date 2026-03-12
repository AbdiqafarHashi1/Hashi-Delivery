import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = (pathname: string) => pathname === "/login" || pathname === "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const role = request.cookies.get("app_role")?.value;

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/entry/today", request.url));
  }

  if (pathname.startsWith("/entry") && role !== "admin" && role !== "data_entry") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/entry/:path*", "/admin/:path*", "/login"]
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

import { auth } from "@/auth";

type AuthRequest = NextRequest & { auth: Session | null };

// Define role-based route protection rules
const ADMIN_ROUTES = ["/admin", "/admin/"];
const TEACHER_ROUTES = ["/teacher", "/teacher/"];

export default auth((req: AuthRequest) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;
  const roles = session?.user?.roles ?? [];

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isProductRoute = pathname === "/product" || pathname.startsWith("/product/");
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isTeacherRoute = TEACHER_ROUTES.some((route) => pathname.startsWith(route));

  // Not authenticated
  if (!session) {
    if (isAuthRoute) return NextResponse.next();

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  if (isAdminRoute && !roles.includes("ADMIN")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isTeacherRoute && !roles.includes("TEACHER") && !roles.includes("ADMIN")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Logged in: redirect auth routes to product
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/product", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

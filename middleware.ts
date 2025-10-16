import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/types";
import { getDefaultRedirectUrl } from "@/lib/permissions";

export default auth((req) => {
  const session = req.auth as any | null;
  const { pathname } = req.nextUrl;
  const userRole = session?.user?.role as UserRole | undefined;

  console.log("Middleware(v5) - Pathname:", pathname);
  console.log("Middleware(v5) - Authenticated:", !!session);
  console.log("Middleware(v5) - User Role:", userRole);

  // If not authenticated and accessing protected routes, go to login
  const protectedMatchers = [
    "/dashboard",
    "/generation",
    "/classroom",
    "/department",
    "/staff",
    "/users",
    "/task",
  ];
  const isProtected = protectedMatchers.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (!session && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Define role-based access for each route
  const roleAccess: Record<string, UserRole[]> = {
    "/classroom": ["admin", "teacher"],
    "/task": ["admin", "teacher", "student"],
    "/users": ["admin", "teacher"],
    "/generation": ["admin", "teacher"],
    "/department": ["admin", "teacher"],
    "/staff": ["admin", "teacher"],
  };

  // Redirect dashboard to role-specific page
  if (pathname === "/dashboard" && session) {
    const defaultUrl = getDefaultRedirectUrl(userRole);
    return NextResponse.redirect(new URL(defaultUrl, req.url));
  }

  // Check if user has access to the current route
  const routeAccess = Object.entries(roleAccess).find(([route]) =>
    pathname.startsWith(route)
  );

  if (routeAccess) {
    const [, allowedRoles] = routeAccess;
    if (!userRole || !allowedRoles.includes(userRole)) {
      const defaultUrl = getDefaultRedirectUrl(userRole);
      return NextResponse.redirect(new URL(defaultUrl, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generation/:path*",
    "/classroom/:path*",
    "/department/:path*",
    "/staff/:path*",
    "/users/:path*",
    "/task/:path*",
  ],
};

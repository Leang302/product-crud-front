import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserRole } from "@/types";
import { getDefaultRedirectUrl } from "@/lib/permissions";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const userRole = token?.role as UserRole | undefined;

    console.log("Middleware - Pathname:", pathname);
    console.log("Middleware - Token:", !!token);
    console.log("Middleware - User Role:", userRole);

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
    if (pathname === "/dashboard") {
      const defaultUrl = getDefaultRedirectUrl(userRole);
      console.log(
        "Middleware - Dashboard accessed, redirecting to:",
        defaultUrl
      );
      return NextResponse.redirect(new URL(defaultUrl, req.url));
    }

    // Check if user has access to the current route
    const routeAccess = Object.entries(roleAccess).find(([route]) =>
      pathname.startsWith(route)
    );

    if (routeAccess) {
      const [, allowedRoles] = routeAccess;

      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to user's default page if they don't have access
        const defaultUrl = getDefaultRedirectUrl(userRole);
        console.log("Middleware - User doesn't have access to", pathname);
        console.log(
          "Middleware - User role:",
          userRole,
          "Allowed roles:",
          allowedRoles
        );
        console.log("Middleware - Redirecting to:", defaultUrl);
        return NextResponse.redirect(new URL(defaultUrl, req.url));
      } else {
        console.log("Middleware - User has access to", pathname);
      }
    } else {
      console.log("Middleware - Route not protected:", pathname);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Middleware - Authorized check:", !!token);
        return !!token;
      },
    },
  }
);

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

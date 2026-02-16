import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];
const REDIRECT_IF_LOGGED_IN = "/product"; // page to redirect logged-in users

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  //if user is logged in and tries to access login or register
  if (isLoggedIn && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(REDIRECT_IF_LOGGED_IN, req.nextUrl));
  }

  //if user is not logged in and tries to access login or register
  if (!isLoggedIn && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  //Protect all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  //Authenticated users can continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export { auth as middleware } from "@/app/api/auth/[...nextauth]/route";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generation/:path*",
    "/classroom/:path*",
    "/department/:path*",
    "/staff/:path*",
    "/task/:path*",
  ],
};

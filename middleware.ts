export { default } from "next-auth/middleware";

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

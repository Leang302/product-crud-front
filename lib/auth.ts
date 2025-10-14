import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRoleSchema } from "@/types";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase();
        const password = String(credentials?.password || "");
        try {
          const res = await fetch(
            "http://167.172.68.245:8088/api/v1/auths/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );
          const text = await res.text();
          const json = text ? JSON.parse(text) : undefined;

          // Expecting ApiResponse<AuthResponse> shape
          const payload = json?.payload ?? json?.data ?? json;
          const accessToken =
            payload?.accessToken || payload?.token || payload?.access_token;
          const refreshToken = payload?.refreshToken || payload?.refresh_token;
          const expiresInSec = payload?.expiresIn || payload?.expires_in;
          const user = payload?.user || payload?.profile || {};

          if (!res.ok && !accessToken) {
            console.error("Login failed:", json);
            return null;
          }

          const role =
            user?.role && UserRoleSchema.safeParse(user.role).success
              ? user.role
              : undefined;

          return {
            id: String(user?.id || user?.userId || email),
            email: user?.email || email,
            name: user?.name || user?.fullName || user?.username || undefined,
            role,
            accessToken,
            refreshToken,
            accessTokenExpires:
              typeof expiresInSec === "number"
                ? Date.now() + expiresInSec * 1000
                : Date.now() + 10 * 60 * 1000, // default 10 minutes
          } as any;
        } catch (_) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in attach tokens
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
      }

      const expires = (token as any).accessTokenExpires as number | undefined;
      if (!expires || Date.now() < expires) return token;

      // Refresh access token if expired
      try {
        const refreshToken = (token as any).refreshToken as string | undefined;
        if (!refreshToken) return token;
        const res = await fetch(
          `http://167.172.68.245:8088/api/v1/auths/refresh?refreshToken=${encodeURIComponent(
            refreshToken
          )}`,
          { method: "POST" }
        );
        const text = await res.text();
        const json = text ? JSON.parse(text) : undefined;
        if (!res.ok) return token;
        const payload = json?.payload ?? json?.data ?? json;
        const accessToken =
          payload?.accessToken || payload?.token || payload?.access_token;
        const expiresInSec = payload?.expiresIn || payload?.expires_in;
        (token as any).accessToken = accessToken;
        (token as any).accessTokenExpires =
          typeof expiresInSec === "number"
            ? Date.now() + expiresInSec * 1000
            : Date.now() + 10 * 60 * 1000;
      } catch (_) {
        // ignore refresh failure; client will be forced to re-login
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

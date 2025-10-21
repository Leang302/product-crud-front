import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema, UserRoleSchema } from "@/types";
import { extractRoleFromJWT } from "@/lib/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials;

        // Try external API for authentication
        try {
          const res = await fetch(`${process.env.BASE_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          const text = await res.text();
          const json = text ? JSON.parse(text) : undefined;

          // Expecting ApiResponse<AuthResponse> shape
          const payload = json?.payload ?? json?.data ?? json;
          const accessToken =
            payload?.accessToken || payload?.token || payload?.access_token;
          const refreshToken = payload?.refreshToken || payload?.refresh_token;
          const expiresInSec = payload?.expiresIn || payload?.expires_in;
          const user = payload?.user || payload?.profile || {};

          if (!res.ok || !accessToken) {
            console.error("External API login failed:", {
              status: res.status,
              statusText: res.statusText,
              response: json,
            });
            return null;
          }

          // Prefer extracting role directly from JWT; fallback to profile
          let role: string | undefined = extractRoleFromJWT(accessToken);
          if (!role) {
            console.log(
              "Fetching user profile to get roles (JWT had no role)..."
            );
            try {
              const profileRes = await fetch(
                `${process.env.BASE_API_URL}/users/profile`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (profileRes.ok) {
                const profileData = await profileRes.json();
                const userRoles = profileData.payload?.roles || [];
                console.log("User roles from profile:", userRoles);

                if (userRoles.includes("admin")) role = "admin";
                else if (userRoles.includes("teacher")) role = "teacher";
                else if (userRoles.includes("student")) role = "student";

                console.log("Extracted role from profile:", role);
              } else {
                console.error(
                  "Failed to fetch user profile:",
                  profileRes.status
                );
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }

          if (!role || !UserRoleSchema.safeParse(role).success) {
            console.error("CRITICAL: No valid role found in user profile!");
            console.log("Available roles from profile:", role);
            return null;
          }

          console.log("Final role assigned:", role);

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
        } catch (error) {
          console.error("External API login error:", {
            message: error instanceof Error ? error.message : "Unknown error",
            name: error instanceof Error ? error.name : "Unknown",
            stack: error instanceof Error ? error.stack : undefined,
          });
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
          `${
            process.env.BASE_API_URL
          }/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
          { method: "POST" }
        );

        const text = await res.text();
        const json = text ? JSON.parse(text) : undefined;
        if (!res.ok) return token;

        const payload = json?.payload ?? json?.data ?? json;
        const accessToken =
          payload?.accessToken || payload?.token || payload?.access_token;
        const expiresInSec = payload?.expiresIn || payload?.expires_in;

        // Extract role from refreshed token using profile endpoint
        if (accessToken) {
          try {
            const profileRes = await fetch(
              `${process.env.BASE_API_URL}/users/profile`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (profileRes.ok) {
              const profileData = await profileRes.json();
              const userRoles = profileData.payload?.roles || [];

              // Look for our specific roles in order of priority
              let refreshedRole: string | undefined;
              if (userRoles.includes("admin")) {
                refreshedRole = "admin";
              } else if (userRoles.includes("teacher")) {
                refreshedRole = "teacher";
              } else if (userRoles.includes("student")) {
                refreshedRole = "student";
              }

              if (
                refreshedRole &&
                UserRoleSchema.safeParse(refreshedRole).success
              ) {
                (token as any).role = refreshedRole;
              }
            }
          } catch (error) {
            console.error("Error fetching user profile during refresh:", error);
          }
        }

        (token as any).accessToken = accessToken;
        (token as any).accessTokenExpires =
          typeof expiresInSec === "number"
            ? Date.now() + expiresInSec * 1000
            : Date.now() + 10 * 60 * 1000;
      } catch (error) {
        console.error("Token refresh failed:", error);
        // ignore refresh failure; client will be forced to re-login
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - Token role:", (token as any).role);
      session.user = {
        ...session.user,
        role: (token as any).role,
      } as any;
      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log(
        "NextAuth redirect callback - URL:",
        url,
        "Base URL:",
        baseUrl
      );

      // If the URL is a relative URL, make it absolute
      if (url.startsWith("/")) {
        const fullUrl = `${baseUrl}${url}`;
        console.log("NextAuth redirect - Full URL:", fullUrl);
        return fullUrl;
      }

      // If the URL is the same as the base URL, redirect to dashboard
      // The middleware will handle role-based redirects from there
      if (url === baseUrl) {
        console.log("NextAuth redirect - Base URL, redirecting to dashboard");
        return `${baseUrl}/dashboard`;
      }

      // If the URL is on the same origin, allow it
      if (url.startsWith(baseUrl)) {
        console.log("NextAuth redirect - Same origin, allowing:", url);
        return url;
      }

      // Otherwise, redirect to dashboard (middleware will handle role-based redirect)
      console.log("NextAuth redirect - Default to dashboard");
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;

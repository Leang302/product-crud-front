import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types";
import { loginService } from "@/services/authService";
import Google from "@auth/core/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
     Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET ,authorization:{
      params:{
        prompt:"select_account"
      }
     }}),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
         console.log("login request",credentials)
        const parsed = LoginSchema.safeParse({
          username: credentials?.username,
          password: credentials?.password,
        });

        if (!parsed.success) {
          return null;
        }

        const { username, password } = parsed.data;

        try {
          const response = await loginService({ username, password });
          
          // Check for successful login
          if (response.status.code !== "AUTH_LOGIN_SUCCESS" || !response.data) {
            throw new Error(response.status.message || "Login failed");
          }

          const { accessToken, expiresIn, user } = response.data;

          if (!accessToken) {
            throw new Error("No access token received");
          }

          return {
            id: user.userId,
            username: user.username,
            roles: user.roles,
            accessToken,
            accessTokenExpires: Date.now() + expiresIn * 1000,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error("Login error:", message);
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    //when we try to get token back from session
    //it will first call jwt to see if there's user session or it's still valid
    //then it will call to session to return the actual value
    async jwt({ token, user,account  }) {
      // On initial sign-in, persist user data to token
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }
        if (account?.provider === "google") {
      const res = await fetch(`${process.env.API_BASE_URL}/auths/login/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: account.id_token,  deviceId: "string"}),
      }).then(r => r.json());

      token.id = res.data.user.userId;
      token.username = res.data.user.username;
      token.roles = res.data.user.roles;
      token.accessToken = res.data.accessToken;
      token.accessTokenExpires = Date.now() + res.data.expiresIn * 1000;
    }

      return token;
    },
    async session({ session, token }) {
      // Map JWT token data to session
      return {
        ...session,
        user: {
          id: token.id as string,
          username: token.username as string,
          roles: token.roles as string[],
        },
        accessToken: token.accessToken as string,
      } as Session;
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
        return `${baseUrl}/product`;
      }

      // If the URL is on the same origin, allow it
      if (url.startsWith(baseUrl)) {
        console.log("NextAuth redirect - Same origin, allowing:", url);
        return url;
      }

      return `${baseUrl}/product`;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { StaticUsers, UserRoleSchema } from "@/types";

// Flatten static users for lookup
const ALL_USERS = [
  ...StaticUsers.admin,
  ...StaticUsers.teacher,
  ...StaticUsers.student,
];

export const authConfig = {
  secret: process.env.AUTH_SECRET,
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
        const user = ALL_USERS.find(
          (u) => u.email.toLowerCase() === email && u.password === password
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      return session;
    },
    authorized({ auth, request }) {
      // Allow public access to auth routes
      const path = request.nextUrl.pathname;
      const isPublicAuth =
        path.startsWith("/login") ||
        path.startsWith("/forgot-password") ||
        path.startsWith("/change-password");
      if (isPublicAuth) return true;
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;

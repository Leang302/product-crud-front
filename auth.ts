// auth.ts (ROOT OF PROJECT)
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginService } from "./lib/services/auth-service"
import { AuthSchema } from "./lib/validation/auth-schema";
import { InvalidLoginError } from "./app/errors/auth-error";
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
      
 const res = await loginService(credentials as AuthSchema);
        const data = await res.json()
        const user = data?.data?.user;
        if (data?.status?.code === "AUTH_LOGIN_SUCCESS") {
          return {
            id: user.userId,
            name: user.username,
            roles: user.roles,
            accessToken: data.data.accessToken,
            expiresAt: Date.now() + data.data.expiresIn * 1000
          }
        }
        throw new InvalidLoginError(data?.status?.message ?? "invalid_credentials")
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.expiresAt = user.expiresAt
        token.roles = user.roles
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.id = token.sub as string
      session.user.roles = token.roles as string[]
      session.expires = new Date(token.expiresAt as number)
      return session
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" }
})

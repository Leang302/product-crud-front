import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      roles: string[]
      accessToken: string
    } & DefaultSession["user"]
    accessToken: string
    expires: Date
  }

  interface User {
    id: string
    name: string
    roles: string[]
    accessToken: string
    expiresAt: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    expiresAt?: number
    roles?: string[]
  }
}
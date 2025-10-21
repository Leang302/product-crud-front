import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: (DefaultSession["user"] & { role?: import("@/types").UserRole }) | null;
		accessToken?: string;
		refreshToken?: string;
	}

	interface User {
		role?: import("@/types").UserRole;
		accessToken?: string;
		refreshToken?: string;
		accessTokenExpires?: number;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: import("@/types").UserRole;
		accessToken?: string;
		refreshToken?: string;
		accessTokenExpires?: number;
	}
}

import { UserRole } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  }
}

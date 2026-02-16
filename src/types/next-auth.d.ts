/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username: string;
			roles: string[];
		};
		accessToken: string;
	}

	interface User {
		id: string;
		username: string;
		roles: string[];
		accessToken: string;
		accessTokenExpires: number;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username: string;
		roles: string[];
		accessToken: string;
		accessTokenExpires: number;
	}
}

import "server-only";
import { z } from "zod";
import { fetchWrapper } from "./utils";

// Schemas
export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["admin", "teacher", "student"]),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginResponseSchema = z.object({
  user: AuthUserSchema,
  token: z.string().optional(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const SessionSchema = z.object({
  user: AuthUserSchema.nullable(),
  expires: z.string().optional(),
});
export type SessionResponse = z.infer<typeof SessionSchema>;

// Actions
export async function loginAction(body: { email: string; password: string }) {
  // POST /api/auth/login
  return fetchWrapper<LoginResponse>("/api/auth/login", {
    method: "POST",
    body,
    schema: LoginResponseSchema,
  });
}

export async function logoutAction() {
  // POST /api/auth/logout
  return fetchWrapper<{ success: boolean }>("/api/auth/logout", {
    method: "POST",
    schema: z.object({ success: z.boolean() }),
  });
}

export async function getSessionAction() {
  // GET /api/auth/session
  return fetchWrapper<SessionResponse>("/api/auth/session", {
    method: "GET",
    schema: SessionSchema,
    cache: "no-store",
  });
}

/*
Usage examples:

// Login
const { user } = await loginAction({ email, password })

// Get session
const session = await getSessionAction()
*/

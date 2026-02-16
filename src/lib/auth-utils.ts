import { auth } from "@/auth";

/**
 * Server-side utility functions for role-based access control
 * Use these in Server Components, Route Handlers, and Server Actions
 */

/**
 * Get the current session with roles
 * @example
 * const session = await getSession();
 * if (session?.user.roles.includes("ADMIN")) { ... }
 */
export async function getSession() {
  return await auth();
}

/**
 * Check if the current user has a specific role
 * @example
 * if (await hasRole("ADMIN")) { ... }
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth();
  return session?.user?.roles?.includes(role) ?? false;
}

/**
 * Check if the current user has any of the specified roles
 * @example
 * if (await hasAnyRole(["ADMIN", "TEACHER"])) { ... }
 */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const session = await auth();
  const userRoles = session?.user?.roles ?? [];
  return roles.some((role) => userRoles.includes(role));
}

/**
 * Check if the current user has all of the specified roles
 * @example
 * if (await hasAllRoles(["ADMIN", "TEACHER"])) { ... }
 */
export async function hasAllRoles(roles: string[]): Promise<boolean> {
  const session = await auth();
  const userRoles = session?.user?.roles ?? [];
  return roles.every((role) => userRoles.includes(role));
}

/**
 * Get the access token for API calls
 * @example
 * const token = await getAccessToken();
 * fetch(url, { headers: { Authorization: `Bearer ${token}` } });
 */
export async function getAccessToken(): Promise<string | undefined> {
  const session = await auth();
  return session?.accessToken;
}

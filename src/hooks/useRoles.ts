"use client";

import { useSession } from "next-auth/react";

/**
 * Custom hook for role-based access control in client components
 * 
 * @example
 * const { roles, hasRole, isAdmin, isTeacher, isStudent } = useRoles();
 * 
 * if (hasRole("ADMIN")) {
 *   // Show admin content
 * }
 */
export function useRoles() {
  const { data: session, status } = useSession();
  const roles = session?.user?.roles ?? [];

  return {
    roles,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    hasRole: (role: string) => roles.includes(role),
    hasAnyRole: (checkRoles: string[]) => checkRoles.some((r) => roles.includes(r)),
    hasAllRoles: (checkRoles: string[]) => checkRoles.every((r) => roles.includes(r)),
    isAdmin: roles.includes("ADMIN"),
    isTeacher: roles.includes("TEACHER"),
    isStudent: roles.includes("STUDENT"),
  };
}

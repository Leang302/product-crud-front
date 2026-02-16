"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

/**
 * Client component for conditional rendering based on user roles
 * 
 * @example
 * <RoleGate allowedRoles={["ADMIN"]}>
 *   <AdminPanel />
 * </RoleGate>
 * 
 * @example
 * <RoleGate allowedRoles={["ADMIN", "TEACHER"]} fallback={<p>Access denied</p>}>
 *   <ManagementDashboard />
 * </RoleGate>
 */
export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  const userRoles = session?.user?.roles ?? [];
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

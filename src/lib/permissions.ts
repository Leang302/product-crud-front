import { UserRole } from "@/types";

// Role-based access control utilities
export const RolePermissions = {
  // Define what each role can access
  admin: ["classroom", "task", "users", "generation", "department", "staff"],
  teacher: ["classroom", "task", "users", "generation", "department", "staff"],
  student: ["task"],
} as const;

// Check if a user role has access to a specific feature
export function hasPermission(
  userRole: UserRole | undefined,
  feature: string
): boolean {
  console.log(`hasPermission - Role: ${userRole}, Feature: ${feature}`);

  if (!userRole) {
    console.log("hasPermission - No user role, returning false");
    return false;
  }

  const permissions = RolePermissions[userRole];
  console.log(`hasPermission - Permissions for ${userRole}:`, permissions);

  const hasAccess = permissions.includes(feature as any);
  console.log(`hasPermission - Has access to ${feature}:`, hasAccess);

  return hasAccess;
}

// Check if a user role can access a specific route
export function canAccessRoute(
  userRole: UserRole | undefined,
  route: string
): boolean {
  if (!userRole) return false;

  const permissions = RolePermissions[userRole];

  // Check if any permission matches the route
  return permissions.some(
    (permission) =>
      route.startsWith(`/${permission}`) || route === `/${permission}`
  );
}

// Get all accessible routes for a user role
export function getAccessibleRoutes(userRole: UserRole | undefined): string[] {
  if (!userRole) return [];

  return RolePermissions[userRole].map((permission) => `/${permission}`);
}

// Check if a user is admin
export function isAdmin(userRole: UserRole | undefined): boolean {
  return userRole === "admin";
}

// Check if a user is teacher or admin
export function isTeacherOrAdmin(userRole: UserRole | undefined): boolean {
  return userRole === "teacher" || userRole === "admin";
}

// Get default redirect URL based on user role
export function getDefaultRedirectUrl(userRole: UserRole | undefined): string {
  switch (userRole) {
    case "admin":
      return "/users"; // Admin goes to user management
    case "teacher":
      return "/classroom"; // Teacher goes to classroom management
    case "student":
      return "/task"; // Student goes to task management
    default:
      return "/dashboard"; // Fallback to dashboard
  }
}

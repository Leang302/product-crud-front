"use client";

import { useSession } from "next-auth/react";
import { useRoles } from "@/hooks/useRoles";

/**
 * Client component example demonstrating role-based access control
 * Uses both useSession and useRoles hooks
 */
export function ClientRoleExample() {
  // Method 1: Using useSession directly
  const { data: session } = useSession();
  const sessionRoles = session?.user?.roles ?? [];

  // Method 2: Using custom useRoles hook
  const { roles, hasRole, isAdmin, isTeacher, isStudent, isLoading } = useRoles();

  if (isLoading) {
    return <div className="p-3 bg-gray-100 rounded">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Using useSession */}
      <div className="p-3 bg-gray-50 rounded">
        <p className="font-medium mb-2">Using useSession():</p>
        <code className="text-sm">
          {`session?.user?.roles.includes("ADMIN")`} = {String(sessionRoles.includes("ADMIN"))}
        </code>
      </div>

      {/* Using useRoles hook */}
      <div className="p-3 bg-gray-50 rounded">
        <p className="font-medium mb-2">Using useRoles() hook:</p>
        <ul className="text-sm space-y-1">
          <li><code>isAdmin</code>: {String(isAdmin)}</li>
          <li><code>isTeacher</code>: {String(isTeacher)}</li>
          <li><code>isStudent</code>: {String(isStudent)}</li>
          <li><code>hasRole("ADMIN")</code>: {String(hasRole("ADMIN"))}</li>
          <li><code>roles</code>: [{roles.join(", ")}]</li>
        </ul>
      </div>

      {/* Conditional rendering in client */}
      {isAdmin && (
        <div className="p-3 bg-green-100 rounded">
          ✓ Admin content visible (client-side useRoles check)
        </div>
      )}

      {hasRole("TEACHER") && (
        <div className="p-3 bg-blue-100 rounded">
          ✓ Teacher content visible (client-side hasRole check)
        </div>
      )}
    </div>
  );
}

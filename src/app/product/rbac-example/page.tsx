import { auth } from "@/auth";
import { hasRole, hasAnyRole } from "@/lib/auth-utils";
import { RoleGate } from "@/components/common/RoleGate";
import { ClientRoleExample } from "./ClientRoleExample";

/**
 * Example page demonstrating role-based access control patterns
 * This page shows how to use roles in:
 * 1. Server Components
 * 2. Client Components
 * 3. Conditional UI Rendering
 */
export default async function RBACExamplePage() {
  // Server Component: Get session directly
  const session = await auth();
  const roles = session?.user?.roles ?? [];

  // Server-side role checks using utility functions
  const isAdmin = await hasRole("ADMIN");
  const isStaff = await hasAnyRole(["ADMIN", "TEACHER"]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Role-Based Access Control Examples</h1>

      {/* Display current user info */}
      <section className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User</h2>
        <p><strong>Username:</strong> {session?.user?.username}</p>
        <p><strong>User ID:</strong> {session?.user?.id}</p>
        <p><strong>Roles:</strong> {roles.join(", ") || "None"}</p>
        <p><strong>Access Token:</strong> {session?.accessToken ? "✓ Available" : "✗ Not available"}</p>
      </section>

      {/* Server Component Role Check */}
      <section className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">1. Server Component Role Check</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using <code>await auth()</code> or utility functions
        </p>
        
        {isAdmin && (
          <div className="p-3 bg-green-100 rounded">
            ✓ You are an ADMIN (server-side check)
          </div>
        )}
        
        {isStaff && (
          <div className="p-3 bg-blue-100 rounded mt-2">
            ✓ You are STAFF (ADMIN or TEACHER) (server-side check)
          </div>
        )}

        {!isAdmin && (
          <div className="p-3 bg-yellow-100 rounded">
            ✗ You are NOT an admin (server-side check)
          </div>
        )}
      </section>

      {/* Client Component Role Check */}
      <section className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">2. Client Component Role Check</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using <code>useSession()</code> or <code>useRoles()</code> hook
        </p>
        <ClientRoleExample />
      </section>

      {/* RoleGate Component */}
      <section className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">3. RoleGate Component</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using <code>&lt;RoleGate&gt;</code> for conditional rendering
        </p>
        
        <RoleGate allowedRoles={["ADMIN"]}>
          <div className="p-3 bg-green-100 rounded">
            ✓ Admin-only content (RoleGate)
          </div>
        </RoleGate>

        <RoleGate 
          allowedRoles={["ADMIN", "TEACHER"]} 
          fallback={<div className="p-3 bg-red-100 rounded mt-2">✗ Staff content hidden</div>}
        >
          <div className="p-3 bg-blue-100 rounded mt-2">
            ✓ Staff content (ADMIN or TEACHER)
          </div>
        </RoleGate>

        <RoleGate allowedRoles={["STUDENT"]}>
          <div className="p-3 bg-purple-100 rounded mt-2">
            ✓ Student-only content
          </div>
        </RoleGate>
      </section>

      {/* Inline Conditional Rendering */}
      <section className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">4. Inline Conditional Rendering</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using <code>{`{roles.includes("ADMIN") && <Component />}`}</code>
        </p>
        
        {roles.includes("ADMIN") && (
          <div className="p-3 bg-green-100 rounded">
            ✓ Admin Panel Button (inline check)
          </div>
        )}

        {roles.includes("TEACHER") && (
          <div className="p-3 bg-blue-100 rounded mt-2">
            ✓ Teacher Dashboard Link (inline check)
          </div>
        )}

        {roles.includes("STUDENT") && (
          <div className="p-3 bg-purple-100 rounded mt-2">
            ✓ Student Portal Link (inline check)
          </div>
        )}
      </section>
    </div>
  );
}

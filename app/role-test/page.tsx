"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDefaultRedirectUrl } from "@/lib/permissions";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";

export default function RoleTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = session?.user?.role as UserRole | undefined;
  const redirectUrl = getDefaultRedirectUrl(userRole);

  const handleTestRedirect = () => {
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Role-Based Redirection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Session Status:</h3>
            <p className="text-sm text-gray-600">{status}</p>
          </div>

          {session ? (
            <div>
              <h3 className="font-medium mb-2">User Information:</h3>
              <p className="text-sm text-gray-600">
                Email: {session.user?.email}
              </p>
              <p className="text-sm text-gray-600">
                Name: {session.user?.name}
              </p>
              <p className="text-sm text-gray-600">
                Role: {userRole || "No role"}
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2">Not logged in</h3>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Redirection Logic:</h3>
            <p className="text-sm text-gray-600">
              Role: <span className="font-mono">{userRole || "undefined"}</span>
            </p>
            <p className="text-sm text-gray-600">
              Redirect URL: <span className="font-mono">{redirectUrl}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleTestRedirect} className="w-full">
              Test Redirect
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full"
            >
              Go to Login
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Go to Landing Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { extractRoleFromJWT, getUserInfoFromJWT } from "@/lib/jwt";
import { getDefaultRedirectUrl } from "@/lib/permissions";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";

export default function JWTTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = session?.user?.role as UserRole | undefined;
  const accessToken = (session as any)?.accessToken;
  const redirectUrl = getDefaultRedirectUrl(userRole);

  const handleTestJWT = () => {
    if (accessToken) {
      console.log("Testing JWT extraction...");
      const extractedRole = extractRoleFromJWT(accessToken);
      console.log("Extracted role:", extractedRole);

      const userInfo = getUserInfoFromJWT(accessToken);
      console.log("User info from JWT:", userInfo);
    } else {
      console.log("No access token available");
    }
  };

  const handleTestRedirect = () => {
    console.log("Test redirect clicked");
    console.log("User role:", userRole);
    console.log("Redirect URL:", redirectUrl);
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>JWT Token Test Page</CardTitle>
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
              <p className="text-sm text-gray-600">
                Access Token: {accessToken ? "Present" : "Missing"}
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2">Not logged in</h3>
            </div>
          )}

          {accessToken && (
            <div>
              <h3 className="font-medium mb-2">JWT Token Info:</h3>
              <p className="text-sm text-gray-600">
                Token Length: {accessToken.length}
              </p>
              <p className="text-sm text-gray-600">
                Token Preview: {accessToken.substring(0, 100)}...
              </p>
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
            <Button onClick={handleTestJWT} className="w-full">
              Test JWT Extraction (Check Console)
            </Button>
            <Button
              onClick={handleTestRedirect}
              variant="outline"
              className="w-full"
            >
              Test Role-Based Redirect
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

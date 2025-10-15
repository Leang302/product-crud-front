"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Debug Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Session Status:</h3>
            <p className="text-sm text-gray-600">{status}</p>
          </div>

          {session ? (
            <div>
              <h3 className="font-medium mb-2">User Info:</h3>
              <p className="text-sm text-gray-600">
                Email: {session.user?.email}
              </p>
              <p className="text-sm text-gray-600">
                Name: {session.user?.name}
              </p>
              <p className="text-sm text-gray-600">
                Role: {session.user?.role}
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2">Not logged in</h3>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={handleGoToDashboard} className="w-full">
              Go to Dashboard
            </Button>
            <Button onClick={handleLogin} variant="outline" className="w-full">
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

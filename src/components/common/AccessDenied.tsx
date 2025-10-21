"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types";

interface AccessDeniedProps {
  requiredRole?: UserRole | UserRole[];
  feature?: string;
}

export default function AccessDenied({
  requiredRole,
  feature,
}: AccessDeniedProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const getRoleText = () => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.join(" or ");
    }
    return requiredRole || "appropriate";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-gray-600">
            <p className="mb-2">
              You don't have permission to access this {feature || "page"}.
            </p>
            <p className="text-sm">
              This feature requires <strong>{getRoleText()}</strong> role.
            </p>
            {userRole && (
              <p className="text-sm mt-2">
                Your current role:{" "}
                <span className="font-medium capitalize">{userRole}</span>
              </p>
            )}
          </div>

          <div className="pt-4">
            <Link href="/dashboard">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

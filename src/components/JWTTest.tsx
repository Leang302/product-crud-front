"use client";

import { useSession } from "next-auth/react";
import { extractRoleFromJWT } from "@/lib/jwt";

export default function JWTTest() {
  const { data: session } = useSession();

  if (!session) {
    return <div>No session</div>;
  }

  const accessToken = session.accessToken;

  if (!accessToken) {
    return <div>No access token</div>;
  }

  const extractedRole = extractRoleFromJWT(accessToken);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold">JWT Test</h3>
      <p>Session Role: {session.user?.role || "undefined"}</p>
      <p>Extracted Role: {extractedRole || "undefined"}</p>
      <p>Access Token Preview: {accessToken.substring(0, 50)}...</p>
    </div>
  );
}

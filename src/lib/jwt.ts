// JWT utility functions for role extraction
export function decodeJWT(token: string) {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Use Buffer in Node.js environment, atob in browser
    let decodedPayload: string;
    if (typeof window === "undefined") {
      // Server-side: use Buffer
      decodedPayload = Buffer.from(paddedPayload, "base64").toString("utf-8");
    } else {
      // Client-side: use atob
      decodedPayload = atob(paddedPayload);
    }

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export function extractRoleFromJWT(token: string): string | undefined {
  console.log("extractRoleFromJWT - Starting extraction");
  console.log("extractRoleFromJWT - Token length:", token.length);

  const decoded = decodeJWT(token);
  if (!decoded) {
    console.log("extractRoleFromJWT - Failed to decode JWT");
    return undefined;
  }

  console.log("extractRoleFromJWT - JWT decoded successfully");
  console.log(
    "extractRoleFromJWT - Full decoded payload:",
    JSON.stringify(decoded, null, 2)
  );

  // Check realm_access.roles first (most common)
  const realmRoles = decoded.realm_access?.roles || [];
  console.log("extractRoleFromJWT - Realm roles:", realmRoles);

  // Look for our specific roles in order of priority
  if (realmRoles.includes("admin")) {
    console.log("Role extracted: admin (from realm_access)");
    return "admin";
  }
  if (realmRoles.includes("teacher")) {
    console.log("Role extracted: teacher (from realm_access)");
    return "teacher";
  }
  if (realmRoles.includes("student")) {
    console.log("Role extracted: student (from realm_access)");
    return "student";
  }

  // Check resource_access patterns
  const resourceAccess = decoded.resource_access || {};
  console.log("extractRoleFromJWT - Resource access:", resourceAccess);

  // Check for client_admin in any resource
  for (const [resourceName, resourceData] of Object.entries(resourceAccess)) {
    if (resourceData?.roles?.includes("client_admin")) {
      console.log(
        `Role extracted: teacher (from ${resourceName}.client_admin)`
      );
      return "teacher";
    }
  }

  console.log("extractRoleFromJWT - No valid role found");
  console.log("extractRoleFromJWT - Available realm roles:", realmRoles);
  console.log(
    "extractRoleFromJWT - Available resource access:",
    Object.keys(resourceAccess)
  );

  return undefined;
}

// Get user information from JWT token
export function getUserInfoFromJWT(token: string) {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    email: decoded.email,
    name: decoded.name,
    preferred_username: decoded.preferred_username,
    given_name: decoded.given_name,
    family_name: decoded.family_name,
    realm_roles: decoded.realm_access?.roles || [],
    resource_roles: decoded.resource_access?.["my-spring-app"]?.roles || [],
    email_verified: decoded.email_verified,
    sub: decoded.sub,
  };
}

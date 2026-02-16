import { auth } from "@/auth";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.BASE_URL;

// Define the generic shape of your API responses
export interface ApiResponse<T> {
  status: {
    code: string;
    message: string;
  };
  data: T;
}

async function getAuthHeader(): Promise<HeadersInit> {
  let token: string | undefined;

  if (typeof window === "undefined") {
    const session = await auth();
    token = session?.accessToken;
  } else {
    const session = await getSession();
    token = (session )?.accessToken;
  }

  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options.headers || {}),
    },
  });

  // Parse the full response body
  const result: ApiResponse<T> = await response.json().catch(() => ({
    status: { code: "PARSE_ERROR", message: "Failed to parse response" },
    data: null as unknown as T,
  }));
  return result;
};
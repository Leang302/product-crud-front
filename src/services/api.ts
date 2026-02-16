// src/services/api.ts
import headerToken from "@/lib/headerToken";
import "server-only";

export const apiRequest = async <TResponse, TRequest = unknown>(
  endpoint: string,
  options: Omit<RequestInit, "body"> & { body?: TRequest }
): Promise<TResponse> => {
  const { body, ...rest } = options;

  const response = await fetch(
    `${process.env.API_BASE_URL}${endpoint}`,
    {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
};

export const jsonRequest = async <T>(
  endpoint: string,
  options: Omit<RequestInit, "headers"> & { body?: unknown }
): Promise<T> => {
  const header = await headerToken();
  if (!header) {
    throw new Error("Authentication token is missing.");
  }

  const { method = "GET", body: requestBody, ...restOptions } = options;

  const newOptions =
    method === "GET" || method === "HEAD"
      ? { ...restOptions }
      : { body: requestBody, ...restOptions };

  return apiRequest<T>(endpoint, {
    method,
    headers: {
      ...header,
    },
    ...newOptions,
  });
};

export const formRequest = async <T>(
  endpoint: string,
  body: Record<string, string>
) => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
};

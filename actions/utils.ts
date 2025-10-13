import "server-only";
import { z } from "zod";

// Central API base URL; prefer server-only env when available
export const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

// Common error shape for APIs (adjust to your backend contract later)
export const ApiErrorSchema = z.object({
  message: z.string().default("Unknown error"),
  code: z.string().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

type FetchWrapperOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  // Optional schema to validate the successful response
  schema?: z.ZodTypeAny;
};

/**
 * fetchWrapper
 * - Server-only typed fetch with JSON handling and error normalization
 * - Throws on !res.ok with parsed error body when possible
 *
 * Example:
 * const data = await fetchWrapper<User[]>("/api/users", { method: "GET", schema: z.array(UserSchema) });
 */
export async function fetchWrapper<T>(
  path: string,
  options: FetchWrapperOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
    // Only attach body if provided and not undefined
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
    cache: options.cache,
    credentials: options.credentials,
    next: options.next,
    signal: options.signal,
    // Avoid keeping schema on the native init
  };

  const res = await fetch(url, init);

  // Try reading JSON either way; backend may return empty on 204
  const text = await res.text();
  const maybeJson = text.length ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    const parsedError = maybeJson ? ApiErrorSchema.safeParse(maybeJson) : null;
    const error: ApiError = parsedError?.success
      ? parsedError.data
      : {
          message: res.statusText || "Request failed",
          code: String(res.status),
        };
    const err = new Error(error.message);
    (err as any).code = error.code ?? String(res.status);
    (err as any).status = res.status;
    (err as any).details = maybeJson;
    throw err;
  }

  const data = maybeJson as T;
  if (options.schema) {
    const parsed = options.schema.safeParse(data);
    if (!parsed.success) {
      const err = new Error("Response validation failed");
      (err as any).issues = parsed.error.issues;
      throw err;
    }
    return parsed.data as T;
  }
  return data;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return undefined;
  }
}

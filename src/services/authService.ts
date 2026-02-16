import { LoginResponseSchema, type LoginResponse, type LoginSchemaType } from "@/types";

const API_BASE_URL = process.env.BASE_API_URL;

export const loginService = async (req: LoginSchemaType): Promise<LoginResponse> => {
  const res = await fetch(`${API_BASE_URL}/auths/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
console.log("login request",req)
  const text = await res.text();
  const json: unknown = text ? JSON.parse(text) : null;
  const parsed = LoginResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(res.statusText || "Request failed");
  }

  if (!res.ok || parsed.data.data === null) {
    throw new Error(`${parsed.data.status.code}: ${parsed.data.status.message}`);
  }

  return parsed.data;
};

import "server-only";
import { z } from "zod";
import { fetchWrapper } from "./utils";

// Schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["admin", "teacher", "student"]),
  status: z.enum(["active", "inactive"]).default("active"),
});
export type UserDTO = z.infer<typeof UserSchema>;

export const UsersListSchema = z.object({
  items: z.array(UserSchema),
  total: z.number(),
});
export type UsersList = z.infer<typeof UsersListSchema>;

// Actions
export async function listUsersAction(params?: {
  role?: string;
  q?: string;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.role) query.set("role", params.role);
  if (params?.q) query.set("q", params.q);
  if (params?.page) query.set("page", String(params.page));
  const path = `/api/users${query.size ? `?${query.toString()}` : ""}`;
  return fetchWrapper<UsersList>(path, {
    method: "GET",
    schema: UsersListSchema,
    cache: "no-store",
  });
}

export async function getUserAction(id: string) {
  return fetchWrapper<UserDTO>(`/api/users/${id}`, {
    method: "GET",
    schema: UserSchema,
    cache: "no-store",
  });
}

export async function createUserAction(body: Omit<UserDTO, "id">) {
  return fetchWrapper<UserDTO>("/api/users", {
    method: "POST",
    body,
    schema: UserSchema,
  });
}

export async function updateUserAction(
  id: string,
  body: Partial<Omit<UserDTO, "id">>
) {
  return fetchWrapper<UserDTO>(`/api/users/${id}`, {
    method: "PUT",
    body,
    schema: UserSchema,
  });
}

export async function deleteUserAction(id: string) {
  return fetchWrapper<{ success: boolean }>(`/api/users/${id}`, {
    method: "DELETE",
    schema: z.object({ success: z.boolean() }),
  });
}

/*
Usage:
const users = await listUsersAction({ role: 'teacher', q: 'leng' })
const user = await getUserAction('user_1')
await createUserAction({ email, firstName, lastName, role: 'teacher', status: 'active' })
*/

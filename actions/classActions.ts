import "server-only";
import { z } from "zod";
import { fetchWrapper } from "./utils";

export const ClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  generationId: z.string().optional(),
  teacherId: z.string().optional(),
  courseType: z.enum(["basic", "advanced"]).default("basic"),
});
export type ClassDTO = z.infer<typeof ClassSchema>;

export const ClassListSchema = z.object({
  items: z.array(ClassSchema),
  total: z.number(),
});
export type ClassList = z.infer<typeof ClassListSchema>;

export async function listClassesAction(params?: {
  teacherId?: string;
  generationId?: string;
}) {
  const query = new URLSearchParams();
  if (params?.teacherId) query.set("teacherId", params.teacherId);
  if (params?.generationId) query.set("generationId", params.generationId);
  const path = `/api/classes${query.size ? `?${query.toString()}` : ""}`;
  return fetchWrapper<ClassList>(path, {
    method: "GET",
    schema: ClassListSchema,
    cache: "no-store",
  });
}

export async function getClassAction(id: string) {
  return fetchWrapper<ClassDTO>(`/api/classes/${id}`, {
    method: "GET",
    schema: ClassSchema,
    cache: "no-store",
  });
}

export async function createClassAction(body: Omit<ClassDTO, "id">) {
  return fetchWrapper<ClassDTO>("/api/classes", {
    method: "POST",
    body,
    schema: ClassSchema,
  });
}

export async function updateClassAction(
  id: string,
  body: Partial<Omit<ClassDTO, "id">>
) {
  return fetchWrapper<ClassDTO>(`/api/classes/${id}`, {
    method: "PUT",
    body,
    schema: ClassSchema,
  });
}

export async function deleteClassAction(id: string) {
  return fetchWrapper<{ success: boolean }>(`/api/classes/${id}`, {
    method: "DELETE",
    schema: z.object({ success: z.boolean() }),
  });
}

/*
Usage:
await createClassAction({ name: 'CS101', teacherId: 't1', courseType: 'basic' })
*/

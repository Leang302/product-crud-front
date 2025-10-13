import "server-only";
import { z } from "zod";
import { fetchWrapper } from "./utils";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  teacherId: z.string(),
  classIds: z.array(z.string()).default([]),
  deadline: z.string().optional(),
  durationMinutes: z.number().optional(),
  type: z.enum(["class_session", "presentation", "assignment"]),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
});
export type TaskDTO = z.infer<typeof TaskSchema>;

export const TaskListSchema = z.object({
  items: z.array(TaskSchema),
  total: z.number(),
});
export type TaskList = z.infer<typeof TaskListSchema>;

export async function listTasksAction(params?: {
  classId?: string;
  teacherId?: string;
  type?: string;
}) {
  const query = new URLSearchParams();
  if (params?.classId) query.set("classId", params.classId);
  if (params?.teacherId) query.set("teacherId", params.teacherId);
  if (params?.type) query.set("type", params.type);
  const path = `/api/tasks${query.size ? `?${query.toString()}` : ""}`;
  return fetchWrapper<TaskList>(path, {
    method: "GET",
    schema: TaskListSchema,
    cache: "no-store",
  });
}

export async function getTaskAction(id: string) {
  return fetchWrapper<TaskDTO>(`/api/tasks/${id}`, {
    method: "GET",
    schema: TaskSchema,
    cache: "no-store",
  });
}

export async function createTaskAction(body: Omit<TaskDTO, "id">) {
  return fetchWrapper<TaskDTO>("/api/tasks", {
    method: "POST",
    body,
    schema: TaskSchema,
  });
}

export async function updateTaskAction(
  id: string,
  body: Partial<Omit<TaskDTO, "id">>
) {
  return fetchWrapper<TaskDTO>(`/api/tasks/${id}`, {
    method: "PUT",
    body,
    schema: TaskSchema,
  });
}

export async function deleteTaskAction(id: string) {
  return fetchWrapper<{ success: boolean }>(`/api/tasks/${id}`, {
    method: "DELETE",
    schema: z.object({ success: z.boolean() }),
  });
}

/*
Usage:
await createTaskAction({ title: 'Quiz 1', teacherId: 't1', classIds: ['c1'], type: 'assignment', deadline: new Date().toISOString() })
*/

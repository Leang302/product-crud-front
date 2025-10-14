// Real API actions for classrooms (client-safe)

// Point to Next.js API routes to avoid CORS
const API_BASE = "/api";

export type ClassroomApi = {
  generationClassId: string;
  courseType: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  subjectIds?: string[];
  generationId: string;
  classId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
};

export async function listClassrooms(
  params?: { page?: number; size?: number },
  opts?: { authToken?: string }
) {
  const page = params?.page ?? 0;
  const size = params?.size ?? 10;
  const generationId = "1492e479-c945-4b60-a1a9-0f399bee4a59";
  const url = `${API_BASE}/generation-classes?generationId=${generationId}&page=${page}&size=${size}`;
  const headers: Record<string, string> = { accept: "*/*" };
  if (opts?.authToken) headers["authorization"] = opts.authToken;
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list classrooms: ${res.status}`);
  const data = await res.json();
  // Normalize common list envelope shapes
  const payload = data?.payload ?? data?.data ?? data;
  const items: ClassroomApi[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.content)
    ? data.content
    : [];
  return { items, raw: data };
}

export async function getClassroomByIdApi(id: string, opts?: { authToken?: string }): Promise<ClassroomApi> {
  const url = `${API_BASE}/classrooms/${id}`;
  const headers: Record<string, string> = { accept: "*/*" };
  if (opts?.authToken) headers["authorization"] = opts.authToken;
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to get classroom: ${res.status}`);
  const data = await res.json();
  return (data?.payload ?? data?.data ?? data) as ClassroomApi;
}

export async function createClassroomApi(body: { name: string; imageUrl?: string }, opts?: { authToken?: string }) {
  const url = `${API_BASE}/classrooms`;
  const headers: Record<string, string> = { accept: "*/*", "Content-Type": "application/json" };
  if (opts?.authToken) headers["authorization"] = opts.authToken;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create classroom: ${res.status}`);
  return res.json();
}

export async function updateClassroomApi(
  id: string,
  body: { name: string; imageUrl?: string; generationId?: string },
  opts?: { authToken?: string }
) {
  const url = `${API_BASE}/classrooms/${id}`;
  const headers: Record<string, string> = { accept: "*/*", "Content-Type": "application/json" };
  if (opts?.authToken) headers["authorization"] = opts.authToken;
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to update classroom: ${res.status}`);
  return res.json();
}

export async function deleteClassroomApi(id: string, opts?: { authToken?: string }) {
  const url = `${API_BASE}/classrooms/${id}`;
  const headers: Record<string, string> = { accept: "*/*" };
  if (opts?.authToken) headers["authorization"] = opts.authToken;
  const res = await fetch(url, { method: "DELETE", headers });
  if (!res.ok) throw new Error(`Failed to delete classroom: ${res.status}`);
  return true;
}

export async function uploadFileApi(file: File, opts?: { authToken?: string }) {
  const url = `/api/files/upload-file`;
  const form = new FormData();
  form.append("file", file);
  const headers: HeadersInit = {};
  if (opts?.authToken) (headers as any)["authorization"] = opts.authToken;
  const res = await fetch(url, { method: "POST", body: form, headers });
  if (!res.ok) throw new Error(`Failed to upload file: ${res.status}`);
  const data = await res.json();
  const payload = data?.payload ?? data?.data ?? data;
  const imageUrl =
    typeof payload === "string"
      ? payload
      : payload?.url || payload?.fileUrl || payload?.path || payload?.location || payload?.imageUrl;
  return { imageUrl, raw: data } as { imageUrl?: string; raw: any };
}



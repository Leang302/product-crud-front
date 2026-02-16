import type { CreateDepartmentInput, Department, UpdateDepartmentInput } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL;

function getHeaders(accessToken?: string) {
  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const message =
      typeof json?.message === "string" ? json.message : res.statusText;
    throw new Error(message || "Request failed");
  }
  return json as T;
}

const DepartmentService = {
  async list(accessToken?: string): Promise<Department[]> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");
    const res = await fetch(`${API_BASE_URL}/department`, {
      method: "GET",
      headers: getHeaders(accessToken),
    });
    return parseJson<Department[]>(res);
  },

  async getById(id: string, accessToken?: string): Promise<Department> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");
    const res = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: "GET",
      headers: getHeaders(accessToken),
    });
    return parseJson<Department>(res);
  },

  async create(data: CreateDepartmentInput, accessToken?: string): Promise<Department> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");
    const res = await fetch(`${API_BASE_URL}/department`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify(data),
    });
    return parseJson<Department>(res);
  },

  async update(id: string, data: UpdateDepartmentInput, accessToken?: string): Promise<Department> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");
    const res = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: "PATCH",
      headers: getHeaders(accessToken),
      body: JSON.stringify(data),
    });
    return parseJson<Department>(res);
  },

  async remove(id: string, accessToken?: string): Promise<void> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");
    const res = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: "DELETE",
      headers: getHeaders(accessToken),
    });
    await parseJson<unknown>(res);
  },
};

export default DepartmentService;

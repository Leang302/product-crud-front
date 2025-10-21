import {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types";
import headerToken from "@/lib/headerToken";

const API_BASE_URL = "http://167.172.68.245:8088/api/v1";

type ApiResponse<T> = { message?: string; payload?: T; status?: string };

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const message =
      (json && (json.message || json.error)) ||
      res.statusText ||
      "Request failed";
    const err = new Error(message);
    (err as any).status = res.status;
    (err as any).details = json;
    throw err;
  }
  if (json && typeof json === "object" && "payload" in json) {
    return (json as ApiResponse<T>).payload as T;
  }
  return json as T;
}

export const DepartmentService = {
  async list(params?: {
    name?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<Department[]> {
    const query = new URLSearchParams();
    if (params?.name) query.set("name", params.name);
    if (params?.page) query.set("page", String(params.page));
    if (params?.size) query.set("size", String(params.size));
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDirection) query.set("sortDirection", params.sortDirection);
    const url = query.size
      ? `${API_BASE_URL}/departments?${query.toString()}`
      : `${API_BASE_URL}/departments`;
    const headers = await headerToken();
    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const data = await handleResponse<any>(res);
    if (Array.isArray(data)) return data as Department[];
    if (data && typeof data === "object") {
      if (Array.isArray((data as any).content))
        return (data as any).content as Department[];
      if (Array.isArray((data as any).items))
        return (data as any).items as Department[];
      if (Array.isArray((data as any).results))
        return (data as any).results as Department[];
    }
    return [];
  },

  async getById(id: string): Promise<Department> {
    const headers = await headerToken();
    const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<Department>(res);
  },

  async create(payload: CreateDepartmentInput): Promise<Department> {
    const headers = await headerToken();
    const res = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return handleResponse<Department>(res);
  },

  async update(
    id: string,
    payload: UpdateDepartmentInput
  ): Promise<Department> {
    const headers = await headerToken();
    const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    return handleResponse<Department>(res);
  },

  async remove(id: string): Promise<{ success: boolean } | void> {
    const headers = await headerToken();
    const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.status === 204) return { success: true };
    return handleResponse(res);
  },
};

export default DepartmentService;

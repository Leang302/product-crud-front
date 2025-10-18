import {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types";
import { getServerAccessToken } from "@/lib/auth";

// Proxy through Next.js to avoid CORS and ensure cookies/session are used
const BASE = "/api/departments";
function getAuthHeader() {
  // Prefer runtime session token if exposed to the client via NEXTAUTH
  const token = (
    typeof window !== "undefined"
      ? (window as any).__NEXTAUTH__?.token
      : undefined
  ) as string | undefined;
  const bearer = token || process.env.NEXT_PUBLIC_API_TOKEN;
  return bearer ? { Authorization: `Bearer ${bearer}` } : {};
}

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

function authHeader(accessToken?: string): HeadersInit {
  const token = accessToken || process.env.NEXT_PUBLIC_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const DepartmentService = {
  async list(
    accessToken?: string,
    params?: {
      name?: string;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDirection?: "ASC" | "DESC";
    }
  ): Promise<Department[]> {
    const query = new URLSearchParams();
    if (params?.name) query.set("name", params.name);
    if (params?.page) query.set("page", String(params.page));
    if (params?.size) query.set("size", String(params.size));
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDirection) query.set("sortDirection", params.sortDirection);
    const url = query.size ? `${BASE}?${query.toString()}` : BASE;
    const token = accessToken ?? (await getServerAccessToken());
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
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

  async getById(id: string, accessToken?: string): Promise<Department> {
    const token = accessToken ?? (await getServerAccessToken());
    const res = await fetch(`${BASE}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      cache: "no-store",
    });
    return handleResponse<Department>(res);
  },

  async create(
    payload: CreateDepartmentInput,
    accessToken?: string
  ): Promise<Department> {
    const token = accessToken ?? (await getServerAccessToken());
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<Department>(res);
  },

  async update(
    id: string,
    payload: UpdateDepartmentInput,
    accessToken?: string
  ): Promise<Department> {
    const token = accessToken ?? (await getServerAccessToken());
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<Department>(res);
  },

  async remove(
    id: string,
    accessToken?: string
  ): Promise<{ success: boolean } | void> {
    const token = accessToken ?? (await getServerAccessToken());
    const res = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
    });
    if (res.status === 204) return { success: true };
    return handleResponse(res);
  },
};

export default DepartmentService;

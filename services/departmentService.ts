import {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types";

const BASE = "http://167.172.68.245:8080/api/v1/departments";
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
  return json as T;
}

function authHeader(accessToken?: string): HeadersInit {
  const token = accessToken || process.env.NEXT_PUBLIC_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const DepartmentService = {
  async list(accessToken?: string): Promise<Department[]> {
    const res = await fetch(BASE, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(accessToken),
      },
      cache: "no-store",
    });
    return handleResponse<Department[]>(res);
  },

  async getById(id: number, accessToken?: string): Promise<Department> {
    const res = await fetch(`${BASE}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(accessToken),
      },
      cache: "no-store",
    });
    return handleResponse<Department>(res);
  },

  async create(
    payload: CreateDepartmentInput,
    accessToken?: string
  ): Promise<Department> {
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(accessToken),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<Department>(res);
  },

  async update(
    id: number,
    payload: UpdateDepartmentInput,
    accessToken?: string
  ): Promise<Department> {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(accessToken),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<Department>(res);
  },

  async remove(
    id: number,
    accessToken?: string
  ): Promise<{ success: boolean } | void> {
    const res = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(accessToken),
      },
    });
    if (res.status === 204) return { success: true };
    return handleResponse(res);
  },
};

export default DepartmentService;

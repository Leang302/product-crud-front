import headerToken from "@/lib/headerToken";

const API_BASE_URL = "http://167.172.68.245:8088/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const error = new Error(
      data?.message || response.statusText || "Request failed"
    );
    (error as any).status = response.status;
    (error as any).details = data;
    throw error;
  }

  return data as T;
}

export const GroupService = {
  async getAllGroups(): Promise<any[]> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<any[]>(response);
  },

  async getGroupById(id: string): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<any>(response);
  },

  async createGroup(groupData: any): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: "POST",
      headers,
      body: JSON.stringify(groupData),
    });
    return handleResponse<any>(response);
  },

  async updateGroup(id: string, groupData: any): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(groupData),
    });
    return handleResponse<any>(response);
  },

  async deleteGroup(id: string): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<any>(response);
  },
};

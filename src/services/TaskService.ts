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

export const TaskService = {
  async getAllTasks(): Promise<any[]> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<any[]>(response);
  },

  async getTaskById(id: string): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<any>(response);
  },

  async createTask(taskData: any): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify(taskData),
    });
    return handleResponse<any>(response);
  },

  async updateTask(id: string, taskData: any): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(taskData),
    });
    return handleResponse<any>(response);
  },

  async deleteTask(id: string): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<any>(response);
  },
};

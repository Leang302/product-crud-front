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

export const ClassroomService = {
  async getAllClassrooms(): Promise<any[]> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<any[]>(response);
  },

  async getClassroomById(id: string): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return handleResponse<any>(response);
  },

  async createClassroom(classroomData: any): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: "POST",
      headers,
      body: JSON.stringify(classroomData),
    });
    return handleResponse<any>(response);
  },

  async updateClassroom(id: string, classroomData: any): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(classroomData),
    });
    return handleResponse<any>(response);
  },

  async deleteClassroom(id: string): Promise<any> {
    const headers = await headerToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<any>(response);
  },
};

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

export const FileService = {
  async uploadFile(file: File): Promise<any> {
    const headers = await headerToken();

    // Remove Content-Type header to let browser set it with boundary for FormData
    const { "Content-Type": _, ...uploadHeaders } = headers;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/files/upload-file`, {
      method: "POST",
      headers: uploadHeaders,
      body: formData,
    });

    return handleResponse<any>(response);
  },
};

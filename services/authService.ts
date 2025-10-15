// Use Next.js API routes to avoid CORS issues
export const API_BASE = "/api/auth";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const error = new Error(
      json?.message || res.statusText || "Request failed"
    );
    (error as any).response = { data: json };
    (error as any).status = res.status;
    throw error;
  }

  return json as T;
}

export const requestOTP = async (email: string) => {
  const res = await fetch(`${API_BASE}/forget-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
};

export const validateOTP = async (email: string, otpCode: string) => {
  const res = await fetch(`${API_BASE}/validate-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otpCode }),
  });
  return handleResponse(res);
};

export const resetPassword = async (email: string, newPassword: string) => {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  return handleResponse(res);
};

export default {
  requestOTP,
  validateOTP,
  resetPassword,
};

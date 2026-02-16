"use server";

import {

  loginService,
} from "@/services/authService";

export const loginAction = async (formData: FormData) => {
  try {
    const loginRequest = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    const response = await loginService(loginRequest);
    return { success: true, data: response };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

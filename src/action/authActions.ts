"use server";

import {
  requestOTP,
  validateOTP,
  resetPassword,
  loginService,
} from "@/services/authService";
import { revalidatePath } from "next/cache";

export const loginAction = async (formData: FormData) => {
  try {
    const loginRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const response = await loginService(loginRequest);
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

export const requestOTPAction = async (email: string) => {
  try {
    const response = await requestOTP(email);
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to request OTP",
    };
  }
};

export const validateOTPAction = async (email: string, otpCode: string) => {
  try {
    const response = await validateOTP(email, otpCode);
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Invalid OTP",
    };
  }
};

export const resetPasswordAction = async (
  email: string,
  newPassword: string
) => {
  try {
    const response = await resetPassword(email, newPassword);
    revalidatePath("/login");
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reset password",
    };
  }
};

"use server"

import { redirect } from "next/navigation"
import { LoginFormData, loginSchema } from "../auth-schema"
import { loginService as loginService } from "../services/auth-service"

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData) as LoginFormData
  
  // Validate with Zod
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { errors: parsed.error.format() }
  }

    const res =await loginService(data);

  const result = await res.json()
  
  if (result.status.code !== "AUTH_LOGIN_SUCCESS") {
    return { serverError: "Invalid credentials" }
  }

  // Set cookie with JWT (use httpOnly cookie)
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `token=${result.data.accessToken}; path=/; expires=${tomorrow}; HttpOnly; Secure`

  redirect("/dashboard")
}

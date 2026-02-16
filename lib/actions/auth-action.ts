"use server"

import { AuthSchema, authSchema } from "../validation/auth-schema"
import { loginService, registerService } from "../services/auth-service"

export const  loginAction= async (data: AuthSchema) => {
  const parsed = authSchema.safeParse(data)
  if (!parsed.success) {
    return { errors: parsed.error.format() }
  }

    const res =await loginService(data);

  const result = await res.json()
  
  if (result.status.code !== "AUTH_LOGIN_SUCCESS") {
   return { serverError: result?.status?.message  };
  }
  return {success:true};
}
export const  registerAction = async (data: AuthSchema) => {

  const parsed = authSchema.safeParse(data);
  if (!parsed.success) {
    return { errors: parsed.error.format() };
  }
  const res = await registerService(data);
  const result = await res.json();
  if (result.status.code !== "USER_CREATED") {
    return { serverError: result?.status?.message  };
  }

  return { success: true };
};
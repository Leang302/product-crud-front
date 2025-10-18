import {fetchWrapper} from "./utils";
import {SessionResponse, SessionSchema} from "@/types";

// export async function logoutAction() {
//   // POST /api/auth/logout
//   return fetchWrapper<{ success: boolean }>("/api/auth/logout", {
//     method: "POST",
//     schema: z.object({ success: z.boolean() }),
//   });
// }

export async function getSessionAction() {
  // GET /api/auth/session
  return fetchWrapper<SessionResponse>("/api/auth/session", {
    method: "GET",
    schema: SessionSchema,
    cache: "no-store",
  });
}
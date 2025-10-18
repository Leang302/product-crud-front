import { auth } from "@/auth";

export const headerToken = async () => {
  const session = await auth();
  if (!session?.user?.accessToken) {
    console.error(" No authentication token available");
    return null;
  }
  // console.log("session :", session);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.user?.accessToken}`,
  };
};
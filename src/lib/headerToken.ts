import { auth } from "@/auth";

const headerToken = async () => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No access token found in session");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };
};

export default headerToken;

import { auth } from "@/auth";

const headerToken = async () => {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("No access token found in session");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.user.accessToken}`,
  };
};

export default headerToken;

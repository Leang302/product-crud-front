import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

const REMOTE_BASE = "http://167.172.68.245:8088/api/v1/users/students/class";

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { search } = new URL(request.url);
  const params = new URLSearchParams(search);
  const genclassId = params.get("genclassId") || params.get("genclassid");
  // Backend expects path segment /genclassid and a query param genclassId
  const url = genclassId
    ? `${REMOTE_BASE}/genclassid?genclassId=${encodeURIComponent(genclassId)}`
    : `${REMOTE_BASE}${search || ""}`;

  console.log("Students API - Session:", !!session);
  console.log("Students API - Session user:", session?.user);
  console.log("Students API - Access Token:", !!accessToken);
  console.log("Students API - Access Token length:", accessToken?.length);
  console.log("Students API - URL:", url);

  if (!accessToken) {
    console.error("Students API - No access token found in session");
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    console.log("Students API - Response Status:", res.status);

    const text = await res.text();
    const body = text ? JSON.parse(text) : {};

    console.log("Students API - Response Body:", body);

    return NextResponse.json(body ?? {}, { status: res.status });
  } catch (e: any) {
    console.error("Students API - Error:", e);
    return NextResponse.json(
      { message: e?.message || "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

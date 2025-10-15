import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

const REMOTE_BASE = "http://167.172.68.245:8088/api/v1/groups";

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  const accessToken = (session as any)?.accessToken as string | undefined;
  const body = await request.json().catch(() => undefined);

  console.log("Groups API - Session:", !!session);
  console.log("Groups API - Access Token:", !!accessToken);
  console.log("Groups API - Request Body:", body);

  try {
    const res = await fetch(REMOTE_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body ?? {}),
    });

    console.log("Groups API - Response Status:", res.status);

    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;

    console.log("Groups API - Response Body:", data);

    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("Groups API - Error:", e);
    return NextResponse.json(
      { message: e?.message || "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

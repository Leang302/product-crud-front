import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

const REMOTE_BASE = "http://167.172.68.245:8088/api/v1/generation-classes";

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { search } = new URL(request.url);
  const url = `${REMOTE_BASE}${search || ""}`;

  console.log("Generation Classes API - Session:", !!session);
  console.log("Generation Classes API - Access Token:", !!accessToken);
  console.log("Generation Classes API - URL:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });

    console.log("Generation Classes API - Response Status:", res.status);

    const text = await res.text();
    const body = text ? JSON.parse(text) : undefined;

    console.log("Generation Classes API - Response Body:", body);

    return NextResponse.json(body, { status: res.status });
  } catch (e: any) {
    console.error("Generation Classes API - Error:", e);
    return NextResponse.json(
      { message: e?.message || "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

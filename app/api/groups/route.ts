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

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { search } = new URL(request.url);
  const url = `${REMOTE_BASE}${search || ""}`;

  console.log("Groups API - GET - Session:", !!session);
  console.log("Groups API - GET - Access Token:", !!accessToken);
  console.log("Groups API - GET - URL:", url);

  if (!accessToken) {
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

    const text = await res.text();
    const body = text ? JSON.parse(text) : {};
    return NextResponse.json(body ?? {}, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

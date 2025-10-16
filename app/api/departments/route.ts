import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const REMOTE_BASE = "http://167.172.68.245:8088/api/v1/departments";

export async function GET(request: Request) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { search } = new URL(request.url);
  const url = `${REMOTE_BASE}${search || ""}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : undefined;
    return NextResponse.json(body, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const body = await request.json().catch(() => undefined);
  try {
    const res = await fetch(REMOTE_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body ?? {}),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

import { NextResponse } from "next/server";

const REMOTE_BASE = "http://localhost:8081/api/v1/auths";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => undefined);
    console.log("Proxy request body:", body);

    const res = await fetch(`${REMOTE_BASE}/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body ?? {}),
    });

    const text = await res.text();
    console.log("Remote response status:", res.status);
    console.log("Remote response body:", text);

    const data = text ? JSON.parse(text) : undefined;
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("Proxy error:", e);
    return NextResponse.json(
      {
        message: e?.message || "Upstream fetch failed",
      },
      { status: 502 }
    );
  }
}

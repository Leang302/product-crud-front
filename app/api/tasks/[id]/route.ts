import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const REMOTE_BASE = "http://167.172.68.245:8088/api/v1/tasks";

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { id } = await ctx.params;
  const url = `${REMOTE_BASE}/${encodeURIComponent(id)}`;
  try {
    const body = await request.json();
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: any = undefined;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = { message: "Upstream returned non-JSON", raw: text };
    }
    return NextResponse.json(data ?? {}, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Upstream update failed" },
      { status: 502 }
    );
  }
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { id } = await ctx.params;
  const url = `${REMOTE_BASE}/${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
    const text = await res.text();
    let data: any = undefined;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text || undefined;
    }
    return NextResponse.json(data ?? {}, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Upstream delete failed" },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const API_BASE = "http://167.172.68.245:8088/api/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Since we're using generationClassId, we might need to use a different endpoint
  // For now, let's try the generation-classes endpoint with the ID
  const url = `${API_BASE}/generation-classes/${params.id}`;
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.text();
  const url = `${API_BASE}/classrooms/${params.id}`;
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  const res = await fetch(url, { method: "PUT", headers, body });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = `${API_BASE}/classrooms/${params.id}`;
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  const res = await fetch(url, { method: "DELETE", headers });
  const text = await res.text();
  return new NextResponse(text || "{}", {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

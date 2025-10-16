import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const API_BASE = "http://167.172.68.245:8088/api/v1/files/upload-file";

export async function POST(req: NextRequest) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;

  // Read incoming form-data
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ message: "file is required" }, { status: 400 });
  }

  // Build outbound multipart/form-data
  const outForm = new FormData();
  outForm.append("file", file);

  const headers: HeadersInit = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const res = await fetch(API_BASE, {
    method: "POST",
    headers,
    body: outForm as any,
  });
  const text = await res.text();
  return new NextResponse(text || "{}", {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

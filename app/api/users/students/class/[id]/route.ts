import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

const REMOTE_BASE = "http://167.172.68.245:8088/api/v1/users/students/class";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  const accessToken = (session as any)?.accessToken as string | undefined;
  const id = params.id;
  const url = `${REMOTE_BASE}/${encodeURIComponent(id)}`;

  console.log("Students API [id] - Session:", !!session);
  console.log("Students API [id] - Session user:", session?.user);
  console.log("Students API [id] - Access Token:", !!accessToken);
  console.log("Students API [id] - URL:", url);

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
